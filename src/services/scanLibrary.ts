import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { libraryLabels, type LibraryResult } from '../models/Library';
import type { FolderKey } from '../models/Settings';
import type { DocumentType } from '../models/DocumentType';

// Read-only traversal. Links and junctions are excluded to avoid leaving the
// selected root or following cycles. No filesystem mutation is performed.
export async function scanLibrary(
  key: FolderKey,
  root: string,
): Promise<LibraryResult> {
  const result: LibraryResult = {
    categories: [{ id: key, name: libraryLabels[key] }],
    documents: [],
    warnings: [],
  };
  if (!root) return result;
  const queue = [{ relative: '', categoryId: key as string }];
  for (let index = 0; index < queue.length; index++) {
    const { relative, categoryId } = queue[index];
    const directory = path.join(root, relative);
    try {
      const entries = await readdir(directory, { withFileTypes: true });
      entries.sort((a, b) =>
        a.name.localeCompare(b.name, 'ca', { numeric: true }),
      );
      for (const entry of entries) {
        if (entry.isSymbolicLink()) continue;
        const relativePath = path.join(relative, entry.name);
        const id = `${key}:${relativePath}`;
        if (entry.isDirectory()) {
          result.categories.push({
            id,
            name: entry.name,
            parentId: categoryId,
          });
          queue.push({ relative: relativePath, categoryId: id });
        } else if (entry.isFile() && !entry.name.startsWith('~$')) {
          const extension = path.extname(entry.name).slice(1).toLowerCase();
          if (!['pdf', 'doc', 'docx'].includes(extension)) continue;
          result.documents.push({
            id,
            title: path.parse(entry.name).name,
            fileName: entry.name,
            filePath: path.join(root, relativePath),
            type: extension as DocumentType,
            categoryId,
            tags: [],
            description: relative || libraryLabels[key],
          });
        }
      }
    } catch {
      result.warnings.push(
        `No es pot llegir la carpeta «${relative || libraryLabels[key]}». Comprova la connexió i els permisos.`,
      );
    }
  }
  return result;
}
