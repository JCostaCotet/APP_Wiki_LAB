export const folderLabels = {
  documents: 'Carpeta documents',
  standards: 'Carpeta normes',
  materials: 'Carpeta Materials',
  clientStandards: 'Carpeta Normes Clients',
} as const;

export type FolderKey = keyof typeof folderLabels;

export interface FolderSettings {
  folderPath: string;
  accessible: boolean;
  error?: string;
}

export interface SettingsApi {
  load: (key: FolderKey) => Promise<FolderSettings>;
  chooseFolder: () => Promise<string | null>;
  save: (key: FolderKey, folderPath: string) => Promise<FolderSettings>;
}
