/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />
declare module '*.css';

interface Window {
  library: import('./models/Library').LibraryApi;
  settings: import('./models/Settings').SettingsApi;
}
