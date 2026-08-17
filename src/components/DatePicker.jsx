import { useEffect, useRef, useState } from 'react';
import arrowBottom from '../assets/arrow_bottom.svg';
import Calendar from './Calendar';
import { formatDateDots } from '../utils/formatters';
import '../styles/DatePicker.css';

function DatePicker({ value, onChange, placeholder = 'YYYY.MM.DD', disabled = false }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const isOpen = open && !disabled;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const handleSelect = (date) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <div className="date-picker" ref={wrapRef}>
      <button
        type="button"
        className={`date-picker-box${isOpen ? ' date-picker-box--open' : ''}${disabled ? ' date-picker-box--disabled' : ''}`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className={`date-picker-value${value ? '' : ' date-picker-value--placeholder'}`}>
          {value ? formatDateDots(value) : placeholder}
        </span>
        <img
          src={arrowBottom}
          alt=""
          className={`date-picker-icon${isOpen ? ' date-picker-icon--open' : ''}`}
        />
      </button>
      {isOpen && <Calendar value={value} onSelect={handleSelect} />}
    </div>
  );
}

export default DatePicker;
