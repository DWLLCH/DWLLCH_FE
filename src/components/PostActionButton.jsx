import '../styles/PostActionButton.css';

function PostActionButton({ icon, label, count, active, onClick }) {
  return (
    <button
      type="button"
      className={`post-action-btn${active ? ' post-action-btn--active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span
        className="post-action-btn-icon"
        style={{ maskImage: `url(${icon})`, WebkitMaskImage: `url(${icon})` }}
      />
      <span>
        {label}
        {count !== undefined ? ` ${count}` : ''}
      </span>
    </button>
  );
}

export default PostActionButton;
