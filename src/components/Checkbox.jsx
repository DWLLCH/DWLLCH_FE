import '../styles/Checkbox.css';

function Checkbox({ id, checked, onChange }) {
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        className="checkbox-input"
        checked={checked}
        onChange={onChange}
      />
      <span className="checkbox-box" />
    </label>
  );
}

export default Checkbox;
