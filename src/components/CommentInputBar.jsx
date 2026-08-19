import { useId } from 'react';
import airplane from '../assets/airplane.svg';
import Checkbox from './Checkbox';
import '../styles/CommentInputBar.css';

function CommentInputBar({
  value,
  onChange,
  onSubmit,
  anonymous,
  onToggleAnonymous,
  hideAnonymous = false,
  placeholder = '댓글 작성시 커뮤니티 가이드를 준수해주세요.',
  compact = false,
}) {
  const anonymousId = useId();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit();
  };

  return (
    <form
      className={`comment-input-bar${compact ? ' comment-input-bar--compact' : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={`comment-input-box${hideAnonymous ? ' comment-input-box--no-anon' : ''}`}>
        {!hideAnonymous && (
          <div className="comment-input-anon">
            <Checkbox
              id={anonymousId}
              checked={anonymous}
              onChange={onToggleAnonymous}
              ariaLabel="익명으로 작성"
            />
            <label htmlFor={anonymousId}>익명</label>
          </div>
        )}
        <input
          type="text"
          className="comment-input-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={compact ? '답글 입력' : '댓글 입력'}
        />
        <button type="submit" className="comment-input-send" aria-label="등록">
          <img src={airplane} alt="" />
        </button>
      </div>
    </form>
  );
}

export default CommentInputBar;
