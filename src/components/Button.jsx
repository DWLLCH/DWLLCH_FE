import '../styles/Button.css';

function Button({ children, onClick, type = 'button', disabled = false, fullWidth = false }) {
  return (
    <button
      type={type}
      className={`btn${fullWidth ? ' btn-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
