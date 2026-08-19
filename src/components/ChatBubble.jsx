import fileIcon from '../assets/fileIcon.svg';
import '../styles/ChatBubble.css';

function ChatBubble({
  sender,
  title,
  text,
  type = 'text',
  imageUrl,
  fileName,
  fileUrl,
  quickReplies,
  onSelectQuickReply,
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

      {quickReplies && quickReplies.length > 0 && (
        <div className="chat-quick-replies">
          {quickReplies.map((option) => (
            <button
              key={option.value}
              type="button"
              className="chat-quick-reply"
              onClick={() => onSelectQuickReply(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatBubble;
