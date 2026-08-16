import clip from '../assets/clip.svg';
import upload from '../assets/upload.svg';
import '../styles/ChatInputBar.css';

function ChatInputBar({ value, onChange, onSubmit, onAttachClick, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  return (
    <form className="chat-input-bar" onSubmit={handleSubmit}>
      <button
        type="button"
        className="chat-input-attach"
        onClick={onAttachClick}
        aria-label="사진·파일 첨부"
        disabled={disabled}
      >
        <img src={clip} alt="" />
      </button>
      <input
        type="text"
        className="chat-input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="궁금한 내용을 입력해주세요"
        aria-label="메시지 입력"
        disabled={disabled}
      />
      <button
        type="submit"
        className="chat-input-send"
        aria-label="전송"
        disabled={disabled || !value.trim()}
      >
        <img src={upload} alt="" />
      </button>
    </form>
  );
}

export default ChatInputBar;
