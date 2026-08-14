import '../styles/CategoryChip.css';

function CategoryChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`category-chip${selected ? ' category-chip--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

export default CategoryChip;
