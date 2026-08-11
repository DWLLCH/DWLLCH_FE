import { useEffect, useRef, useState } from 'react';
import arrowBottom from '../assets/arrow_bottom.svg';
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
      >
        <span className={`dropdown-value${value ? '' : ' dropdown-value--placeholder'}`}>
          {value || placeholder}
        </span>
        <img
          src={arrowBottom}
          alt=""
          className={`dropdown-arrow${open ? ' dropdown-arrow--open' : ''}`}
        />
      </button>
      {open && (
        <ul className="dropdown-panel">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className="dropdown-option"
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
