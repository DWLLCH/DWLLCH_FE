import { useEffect, useRef, useState } from 'react';
import arrowBottom from '../assets/arrow_bottom.svg';
import Calendar from './Calendar';
import { formatDateDots } from '../utils/formatters';
import '../styles/DatePicker.css';

function DatePicker({ value, onChange, placeholder = 'YYYY.MM.DD' }) {
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

  const handleSelect = (date) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <div className="date-picker" ref={wrapRef}>
      <button
        type="button"
        className={`date-picker-box${open ? ' date-picker-box--open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`date-picker-value${value ? '' : ' date-picker-value--placeholder'}`}>
          {value ? formatDateDots(value) : placeholder}
        </span>
        <img
          src={arrowBottom}
          alt=""
          className={`date-picker-icon${open ? ' date-picker-icon--open' : ''}`}
        />
      </button>
      {open && <Calendar value={value} onSelect={handleSelect} />}
    </div>
  );
}

export default DatePicker;
