import { documents } from '../data/documents';

interface DocumentListProps {
  categoryId: string | null;
}

function DocumentList({ categoryId }: DocumentListProps) {
  const filteredDocuments = categoryId
    ? documents.filter(
        (document) => document.categoryId === categoryId,
      )
    : documents;

  return (
    <section className="document-list">
      <h2>Documents</h2>

      <ul>
        {filteredDocuments.map((document) => (
          <li key={document.id}>
            {document.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default DocumentList;