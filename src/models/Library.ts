import type { Category } from './Category';
import type { Document } from './Document';
import type { FolderKey } from './Settings';

export const libraryLabels: Record<FolderKey, string> = {
  documents: 'Documents',
  standards: 'Normes',
  materials: 'Materials',
  clientStandards: 'Normes Clients',
};

export interface LibraryResult {
  categories: Category[];
  documents: Document[];
  warnings: string[];
}

export interface LibraryApi {
  scan: (key: FolderKey) => Promise<LibraryResult>;
}
