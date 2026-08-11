import '../styles/Checkbox.css';

function Checkbox({ id, checked, onChange, ariaLabel }) {
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        className="checkbox-input"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
      />
      <span className="checkbox-box" />
    </label>
  );
}

export default Checkbox;
