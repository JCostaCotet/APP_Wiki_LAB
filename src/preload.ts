import { contextBridge, ipcRenderer } from 'electron';
import type { SettingsApi } from './models/Settings';

const settings: SettingsApi = {
  load: (key) => ipcRenderer.invoke('settings:load', key),
  chooseFolder: () => ipcRenderer.invoke('settings:choose-folder'),
  save: (key, folderPath) =>
    ipcRenderer.invoke('settings:save', key, folderPath),
};

contextBridge.exposeInMainWorld('settings', settings);
contextBridge.exposeInMainWorld('library', {
  scan: (key: import('./models/Settings').FolderKey) =>
    ipcRenderer.invoke('library:scan', key),
} satisfies import('./models/Library').LibraryApi);
