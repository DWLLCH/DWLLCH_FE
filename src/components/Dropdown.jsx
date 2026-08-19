import { useEffect, useRef, useState } from 'react';
import arrowBottom from '../assets/arrow_bottom.svg';
import arrowUp from '../assets/arrow_up.svg';
import radioChecked from '../assets/click_fill.svg';
import radioUnchecked from '../assets/click_none.svg';
import '../styles/Dropdown.css';

function Dropdown({ placeholder, value, options, onChange, disabled = false, className = '' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className={`dropdown${className ? ` ${className}` : ''}`} ref={wrapRef}>
      <button
        type="button"
        className={`dropdown-box${open ? ' dropdown-box--open' : ''}`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`dropdown-value${value ? '' : ' dropdown-value--placeholder'}`}>
          {value || placeholder}
        </span>
        <img src={open ? arrowUp : arrowBottom} alt="" className="dropdown-arrow" />
      </button>
      {open && (
        <ul className="dropdown-panel" role="listbox">
          <li role="presentation">
            <button
              type="button"
              className="dropdown-option"
              role="option"
              aria-selected={!value}
              onClick={() => handleSelect('')}
            >
              <img src={!value ? radioChecked : radioUnchecked} alt="" />
              <span>{placeholder}</span>
            </button>
          </li>
          {options.map((option) => (
            <li key={option} role="presentation">
              <button
                type="button"
                className="dropdown-option"
                role="option"
                aria-selected={value === option}
                onClick={() => handleSelect(option)}
              >
                <img src={value === option ? radioChecked : radioUnchecked} alt="" />
                <span>{option}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
