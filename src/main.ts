import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { constants } from 'node:fs';
import { access, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import {
  folderLabels,
  type FolderKey,
  type FolderSettings,
} from './models/Settings';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { scanLibrary } from './services/scanLibrary';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const settingsFile = path.join(app.getPath('userData'), 'settings.json');
  const requireKey = (value: unknown): FolderKey => {
    if (typeof value !== 'string' || !Object.hasOwn(folderLabels, value))
      throw new Error('Carpeta desconeguda.');
    return value as FolderKey;
  };
  const readPaths = async (): Promise<Partial<Record<FolderKey, string>>> => {
    try {
      const saved = JSON.parse(await readFile(settingsFile, 'utf8'));
      const paths: Partial<Record<FolderKey, string>> = {};
      for (const key of Object.keys(folderLabels) as FolderKey[]) {
        const value =
          saved.folders?.[key] ??
          (key === 'documents' ? saved.folderPath : undefined);
        if (value !== undefined && typeof value !== 'string')
          throw new Error('Invalid settings');
        if (value !== undefined) paths[key] = value;
      }
      return paths;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
      throw error;
    }
  };
  let pendingSave: Promise<unknown> = Promise.resolve();
  ipcMain.handle('library:scan', async (_event, requestedKey: unknown) => {
    const key = requireKey(requestedKey);
    const paths = await readPaths();
    return scanLibrary(key, paths[key] ?? '');
  });
  const validate = async (folderPath: string): Promise<FolderSettings> => {
    if (!folderPath) return { folderPath: '', accessible: false };
    try {
      if (!path.isAbsolute(folderPath))
        throw new Error('absolute path required');
      await access(folderPath, constants.R_OK);
      await readdir(folderPath);
      return { folderPath, accessible: true };
    } catch {
      return {
        folderPath,
        accessible: false,
        error:
          'No es pot accedir a la carpeta. Comprova la ruta, la connexió de xarxa i els permisos.',
      };
    }
  };
  ipcMain.handle('settings:load', async (_event, requestedKey: unknown) => {
    const key = requireKey(requestedKey);
    try {
      const paths = await readPaths();
      return validate(paths[key] ?? '');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT')
        return validate('');
      return {
        folderPath: '',
        accessible: false,
        error:
          'No s’ha pogut llegir la configuració. Torna a seleccionar la carpeta.',
      };
    }
  });
  ipcMain.handle('settings:choose-folder', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Selecciona una carpeta existent',
      properties: ['openDirectory'],
    });
    return result.canceled ? null : result.filePaths[0];
  });
  ipcMain.handle(
    'settings:save',
    async (_event, requestedKey: unknown, value: unknown) => {
      const key = requireKey(requestedKey);
      if (typeof value !== 'string' || !value.trim())
        throw new Error('Indica una ruta.');
      const result = await validate(value.trim());
      if (!result.accessible) return result;
      const save = pendingSave
        .catch(() => {})
        .then(async () => {
          const folders = await readPaths();
          folders[key] = result.folderPath;
          await writeFile(
            `${settingsFile}.tmp`,
            JSON.stringify({ folders }),
            'utf8',
          );
          await rename(`${settingsFile}.tmp`, settingsFile);
        });
      pendingSave = save;
      await save;
      return result;
    },
  );
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
