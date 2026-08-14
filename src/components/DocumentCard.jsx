import StatusChip from './StatusChip';
import '../styles/DocumentCard.css';

function DocumentCard({
  number,
  title,
  description,
  checked,
  issueMethod,
  preparation,
  linkLabel,
  linkUrl,
}) {
  return (
    <div className="document-card">
      <div className="document-card-heading">
        <span className="document-card-number">{number}</span>
        <p className="document-card-title">{title}</p>
        <StatusChip status={checked ? 'done' : 'todo'} size="sm" />
      </div>
      <p className="document-card-desc">{description}</p>
      <div className="document-card-info">
        <div className="document-card-info-col">
          <p className="document-card-info-label">발급 방법</p>
          <p className="document-card-info-value">{issueMethod}</p>
        </div>
        <div className="document-card-info-col">
          <p className="document-card-info-label">준비물</p>
          <p className="document-card-info-value">{preparation}</p>
        </div>
      </div>
      {linkUrl && (
        <div className="document-card-link-row">
          <a
            className="document-card-link"
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{linkLabel}</span>
            <span className="document-card-link-icon" />
          </a>
        </div>
      )}
    </div>
  );
}

export default DocumentCard;
