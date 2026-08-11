import '../styles/OptionChip.css';

function OptionChip({ label, selected, onClick, fullWidth = false }) {
  return (
    <button
      type="button"
      className={`option-chip${fullWidth ? ' option-chip--full' : ''}${selected ? ' option-chip--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

export default OptionChip;
