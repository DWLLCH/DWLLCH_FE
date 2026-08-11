import '../styles/DuplicateCheckButton.css';

function DuplicateCheckButton({ status = 'idle', onClick, disabled = false }) {
  const isAvailable = status === 'available';

  return (
    <button
      type="button"
      className={`duplicate-check-btn${isAvailable ? ' duplicate-check-btn--available' : ''}`}
      onClick={onClick}
      disabled={disabled || isAvailable}
    >
      {isAvailable ? '사용가능' : '중복확인'}
    </button>
  );
}

export default DuplicateCheckButton;
