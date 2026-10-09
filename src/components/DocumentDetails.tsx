import type { Document } from '../models/Document';

interface DocumentDetailsProps {
  document: Document;
}

function DocumentDetails({ document }: DocumentDetailsProps) {
  return (
    <section className="document-details">
      <h2>{document.title}</h2>

      {document.description && (
        <p>{document.description}</p>
      )}

      <p>Fitxer: {document.fileName}</p>
      <p>Format: {document.type.toUpperCase()}</p>
    </section>
  );
}

export default DocumentDetails;