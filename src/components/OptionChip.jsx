import '../styles/OptionChip.css';

function OptionChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`option-chip${selected ? ' option-chip--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

export default OptionChip;
