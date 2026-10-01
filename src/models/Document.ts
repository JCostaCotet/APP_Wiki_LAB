export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  type: 'pdf' | 'doc' | 'docx';
  categoryId: string;
  tags: string[];
}