const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');

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
  });
  return exports;
}
async function run() {
  const root = '\\\\server\\read-only-documents';
  const entry = (name, kind) => ({
    name,
    isSymbolicLink: () => kind === 'link',
    isDirectory: () => kind === 'directory',
    isFile: () => kind === 'file',
  });
  const tree = new Map([
    [
      path.join(root, ''),
      [
        entry('Norma.PDF', 'file'),
        entry('README.txt', 'file'),
        entry('Procés', 'directory'),
        entry('Extern', 'link'),
        entry('Denegat', 'directory'),
        entry('~$editable.docx', 'file'),
      ],
    ],
    [
      path.join(root, 'Procés'),
      [entry('Manual.doc', 'file'), entry('Detalls', 'directory')],
    ],
    [path.join(root, 'Procés', 'Detalls'), [entry('Manual.docx', 'file')]],
  ]);
  const reads = [];
  const fakeFs = new Proxy(
    {
      readdir: async (directory) => {
        reads.push(directory);
        if (!tree.has(directory)) throw new Error('Access denied');
        return tree.get(directory);
      },
    },
    {
      get(target, name) {
        if (!(name in target))
          throw new Error(`Forbidden filesystem API: ${String(name)}`);
        return target[name];
      },
    },
  );
  const { scanLibrary } = compile('src/services/scanLibrary.ts', {
    'node:fs/promises': fakeFs,
    '../models/Library': compile('src/models/Library.ts', {}),
  });
  const result = await scanLibrary('documents', root);
  assert.equal(result.documents.length, 3);
  assert.deepEqual(Array.from(result.documents, (doc) => doc.type).sort(), [
    'doc',
    'docx',
    'pdf',
  ]);
  assert.equal(result.categories.length, 4);
  assert.equal(
    result.categories.find((item) => item.name === 'Detalls').parentId,
    'documents:Procés',
  );
  assert.equal(result.warnings.length, 1);
  assert.ok(result.warnings[0].includes('Denegat'));
  assert.ok(!reads.some((directory) => directory.includes('Extern')));
  assert.equal((await scanLibrary('materials', '')).documents.length, 0);
  assert.equal(
    (await scanLibrary('standards', '\\\\server\\offline')).warnings.length,
    1,
  );
  const other = await scanLibrary('materials', root);
  assert.notEqual(other.documents[0].id, result.documents[0].id);
  console.log(
    'PASS: recursive PDF/DOC/DOCX listing, hierarchy, unsupported and temporary file exclusion, partial errors, offline root, link exclusion, independent IDs, and read-only filesystem API.',
  );
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
