import airplane from '../assets/airplane.svg';
import Checkbox from './Checkbox';
import '../styles/CommentInputBar.css';

function CommentInputBar({
  value,
  onChange,
  onSubmit,
  anonymous,
  onToggleAnonymous,
  placeholder = '댓글 작성시 커뮤니티 가이드를 준수해주세요.',
  compact = false,
}) {
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
      <div className="comment-input-box">
        <label className="comment-input-anon">
          <Checkbox
            id={compact ? undefined : 'comment-anonymous'}
            checked={anonymous}
            onChange={onToggleAnonymous}
            ariaLabel="익명으로 작성"
          />
          <span>익명</span>
        </label>
        <input
          className="comment-input-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button type="submit" className="comment-input-send" aria-label="등록">
          <img src={airplane} alt="" />
        </button>
      </div>
    </form>
  );
}

export default CommentInputBar;
