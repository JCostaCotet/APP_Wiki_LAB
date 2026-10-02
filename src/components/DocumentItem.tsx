import type { Document } from '../models/Document';

interface DocumentItemProps {
  document: Document;
  onSelect: (documentId: string) => void;
}

function DocumentItem({
  document,
  onSelect,
}: DocumentItemProps) {
  return (
    <li
      className="document-item"
      onClick={() => onSelect(document.id)}
    >
      <h3 className="document-item-title">
        {document.title}
      </h3>

      {document.description && (
        <p className="document-item-description">
          {document.description}
        </p>
      )}

      <span className="document-item-type">
        {document.type.toUpperCase()}
      </span>
    </li>
  );
}

export default DocumentItem;