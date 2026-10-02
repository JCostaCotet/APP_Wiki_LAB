import { documents } from '../data/documents';
import { categories } from '../data/categories';
import DocumentItem from './DocumentItem';

interface DocumentListProps {
  categoryId: string | null;
}

function DocumentList({ categoryId }: DocumentListProps) {
  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  );

  const filteredDocuments = categoryId
    ? documents.filter(
        (document) => document.categoryId === categoryId,
      )
    : documents;

  return (
    <section className="document-list">
      <h2>
        {selectedCategory
          ? `Documents > ${selectedCategory.name}`
          : 'Documents'}
      </h2>

      <ul className="document-items">
        {filteredDocuments.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
          />
        ))}
      </ul>
    </section>
  );
}

export default DocumentList;