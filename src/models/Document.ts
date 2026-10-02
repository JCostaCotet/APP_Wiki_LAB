import type { DocumentType} from './DocumentType';

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  type: DocumentType;
  categoryId: string;
  tags: string[];
}