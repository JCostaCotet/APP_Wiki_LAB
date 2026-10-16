import type { Category } from '../models/Category';
import type { Document } from '../models/Document';
import DocumentItem from './DocumentItem';

interface DocumentListProps {
  categoryId: string | null;
  categories: Category[];
  documents: Document[];
  loading: boolean;
  onSelectDocument: (documentId: string) => void;
}

export default function DocumentList({
  categoryId,
  categories,
  documents,
  loading,
  onSelectDocument,
}: DocumentListProps) {
  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  );
  const included = new Set(categoryId ? [categoryId] : []);
  for (const category of categories) {
    if (category.parentId && included.has(category.parentId))
      included.add(category.id);
  }
  const filtered = categoryId
    ? documents.filter((document) => included.has(document.categoryId))
    : documents;
  return (
    <section className="document-list" aria-busy={loading}>
      <h2>
        {selectedCategory
          ? `Documents › ${selectedCategory.name}`
          : 'Documents'}
      </h2>
      <p className="document-count">
        {filtered.length} {filtered.length === 1 ? 'document' : 'documents'}
        {loading ? ' · Llegint les carpetes…' : ''}
      </p>
      {!loading && !filtered.length && (
        <p className="empty-library">
          No s’han trobat documents PDF, DOC o DOCX en aquest apartat.
        </p>
      )}
      <ul className="document-items">
        {filtered.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
            onSelect={onSelectDocument}
          />
        ))}
      </ul>
    </section>
  );
}
