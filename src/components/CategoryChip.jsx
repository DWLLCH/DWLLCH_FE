import '../styles/CategoryChip.css';

function CategoryChip({ label, selected, onClick, disabled = false }) {
  return (
    <button
      type="button"
      className={`category-chip${selected ? ' category-chip--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default CategoryChip;
