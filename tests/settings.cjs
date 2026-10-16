const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

async function run() {
  const handlers = {};
  const settingsFile = path.join('C:\\local-settings', 'settings.json');
  const files = new Map([
    [settingsFile, JSON.stringify({ folderPath: '\\\\server\\documents' })],
  ]);
  const writes = [];
  const fakeFs = {
    readFile: async (file) => {
      if (!files.has(file))
        throw Object.assign(new Error('missing'), { code: 'ENOENT' });
      return files.get(file);
    },
    access: async (folder) => {
      if (folder.includes('missing')) throw new Error('offline');
    },
    readdir: async () => [],
    writeFile: async (file, value) => {
      writes.push(file);
      files.set(file, value);
    },
    rename: async (from, to) => {
      writes.push(to);
      files.set(to, files.get(from));
      files.delete(from);
    },
  };
  function compile(file, imports) {
    const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText;
    const exports = {};
    vm.runInNewContext(output, {
      exports,
      require: (name) => imports[name] ?? require(name),
      __dirname: process.cwd(),
      process,
      MAIN_WINDOW_VITE_DEV_SERVER_URL: 'http://localhost',
    });
    return exports;
  }
  class FakeWindow {
    webContents = { openDevTools() {} };
    loadURL() {}
  }
  compile('src/main.ts', {
    electron: {
      app: {
        whenReady: () => Promise.resolve(),
        getPath: () => 'C:\\local-settings',
        on() {},
      },
      BrowserWindow: FakeWindow,
      ipcMain: {
        handle: (name, callback) => {
          handlers[name] = callback;
        },
      },
      dialog: { showOpenDialog: async () => ({ canceled: true }) },
    },
    'electron-squirrel-startup': false,
    './services/scanLibrary': {
      scanLibrary: async () => ({
        categories: [],
        documents: [],
        warnings: [],
      }),
    },
    'node:fs/promises': fakeFs,
    './models/Settings': compile('src/models/Settings.ts', {}),
  });
  await Promise.resolve();
  const load = (key) => handlers['settings:load']({}, key);
  const save = (key, value) => handlers['settings:save']({}, key, value);
  assert.equal((await load('documents')).folderPath, '\\\\server\\documents');
  assert.equal((await load('materials')).folderPath, '');
  await Promise.all([
    save('standards', '\\\\server\\standards'),
    save('materials', '\\\\server\\materials'),
    save('clientStandards', '\\\\server\\clients'),
  ]);
  for (const [key, value] of Object.entries({
    documents: 'documents',
    standards: 'standards',
    materials: 'materials',
    clientStandards: 'clients',
  })) {
    assert.equal((await load(key)).folderPath, `\\\\server\\${value}`);
  }
  assert.equal(
    (await save('standards', '\\\\server\\missing')).accessible,
    false,
  );
  assert.equal((await load('standards')).folderPath, '\\\\server\\standards');
  await assert.rejects(save('unknown', '\\\\server\\other'));
  assert.equal(await handlers['settings:choose-folder'](), null);
  assert.ok(
    writes.every(
      (file) => file === settingsFile || file === `${settingsFile}.tmp`,
    ),
  );
  console.log(
    'PASS: legacy migration, four independent routes, concurrent saves, invalid path preservation, key validation, picker cancellation and local-only writes.',
  );
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
