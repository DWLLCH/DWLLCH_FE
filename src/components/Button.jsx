import '../styles/Button.css';

function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  variant = 'green',
  className = '',
}) {
  return (
    <button
      type={type}
      className={`btn${fullWidth ? ' btn-full' : ''}${variant !== 'green' ? ` btn-${variant}` : ''}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
