import fileIcon from '../assets/fileIcon.svg';
import {
  MISSING_FIELD_LABELS,
  RISK_GRADE_LABELS,
  STRUCTURED_REPORT_FIELDS,
} from '../constants/chatbot';
import '../styles/ChatBubble.css';

// 항목 값이 0처럼 falsy해도 유효한 값이면 그대로 보여주고, null/undefined일 때만 안내 문구로 대체함
function formatReportValue(value) {
  return value === null || value === undefined || value === '' ? '확인되지 않음' : value;
}

function ChatBubble({
  sender,
  title,
  text,
  type = 'text',
  imageUrl,
  fileName,
  fileUrl,
  structured,
  tail = false,
}) {
  const lines = text ? text.split('\n') : [];

  return (
    <div className={`chat-bubble chat-bubble--${sender}${tail ? ' chat-bubble--tail' : ''}`}>
      {type === 'image' && imageUrl && (
        <a
          href={imageUrl}
          download={fileName || '첨부 이미지'}
          className="chat-bubble-image-link"
          aria-label="이미지 다운로드"
        >
          <img src={imageUrl} alt="첨부 이미지" className="chat-bubble-image" />
        </a>
      )}

      {type === 'file' && fileName && (
        <a href={fileUrl} download={fileName} className="chat-bubble-file">
          <span className="chat-bubble-file-icon-wrap">
            <img src={fileIcon} alt="" className="chat-bubble-file-icon" />
          </span>
          <span className="chat-bubble-file-name">{fileName}</span>
        </a>
      )}

      {(title || lines.length > 0) && (
        <div className="chat-bubble-text">
          {title && <p className="chat-bubble-title">{title}</p>}
          {lines.map((line, index) => (
            <p key={`${index}-${line}`}>{line || ' '}</p>
          ))}
        </div>
      )}

      {type === 'structured-summary' && structured && (
        <div className="chat-structured-summary">
          <div className="chat-structured-header">
            <p className="chat-structured-title">상황 정리</p>
            {structured.riskGrade && (
              <span
                className={`chat-structured-grade chat-structured-grade--${structured.riskGrade.toLowerCase()}`}
              >
                위험도 {RISK_GRADE_LABELS[structured.riskGrade] || structured.riskGrade}
              </span>
            )}
          </div>
          <dl className="chat-structured-rows">
            {STRUCTURED_REPORT_FIELDS.map(({ key, label }) => (
              <div className="chat-structured-row" key={key}>
                <dt>{label}</dt>
                <dd>{formatReportValue(structured.report?.[key])}</dd>
              </div>
            ))}
          </dl>
          {structured.missingFields && structured.missingFields.length > 0 && (
            <p className="chat-structured-missing">
              아직 확인 안 된 부분:{' '}
              {structured.missingFields
                .map((field) => MISSING_FIELD_LABELS[field] || field)
                .join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatBubble;
