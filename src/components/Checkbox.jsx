import '../styles/Checkbox.css';

function Checkbox({ id, checked, onChange, ariaLabel }) {
  // 체크박스는 브라우저 기본 동작상 스페이스로만 토글되고 엔터는 안 먹음(표준 동작), 엔터도 되게 직접 처리함
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    onChange();
  };

  return (
    <label className="checkbox" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        className="checkbox-input"
        checked={checked}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
      />
      <span className="checkbox-box" />
    </label>
  );
}

export default Checkbox;
