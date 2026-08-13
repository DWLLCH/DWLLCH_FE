import { useEffect, useRef } from 'react';
import '../styles/SortMenu.css';

function SortMenu({ open, value, options, onSelect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sort-menu" ref={ref}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`sort-menu-item${value === option ? ' sort-menu-item--selected' : ''}`}
          onClick={() => {
            onSelect(option);
            onClose();
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default SortMenu;
