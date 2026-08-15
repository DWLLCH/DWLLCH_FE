import '../styles/Toggle.css';

function Toggle({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`toggle${checked ? ' toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob" />
    </button>
  );
}

export default Toggle;
