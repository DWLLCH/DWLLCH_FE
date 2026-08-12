import '../styles/FilterChip.css';

function FilterChip({ label, selected = false, onClick }) {
  return (
    <button
      type="button"
      className={`filter-chip${selected ? ' filter-chip--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

export default FilterChip;
