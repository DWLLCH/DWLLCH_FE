import '../styles/ActionButton.css';

function ActionButton({ label = '확인하기', filled = false, onClick }) {
  return (
    <button
      type="button"
      className={`action-btn${filled ? ' action-btn--filled' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default ActionButton;
