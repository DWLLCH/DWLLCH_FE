import { useState } from 'react';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Calendar.css';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getMonthCells(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const cells = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, current: false });
    nextDay += 1;
  }
  return cells;
}

function isSameDate(a, b) {
  return (
    a instanceof Date &&
    b instanceof Date &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function Calendar({ value, onSelect }) {
  const initial = value instanceof Date ? value : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const cells = getMonthCells(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-nav">
        <button
          type="button"
          className="calendar-nav-btn calendar-nav-btn--prev"
          onClick={handlePrevMonth}
          aria-label="이전 달"
        >
          <img src={arrowRight} alt="" />
        </button>
        <span className="calendar-nav-label">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          type="button"
          className="calendar-nav-btn"
          onClick={handleNextMonth}
          aria-label="다음 달"
        >
          <img src={arrowRight} alt="" />
        </button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((cell, index) => {
          const cellDate = cell.current ? new Date(viewYear, viewMonth, cell.day) : null;
          const selected = cell.current && isSameDate(cellDate, value);
          return (
            <button
              key={index}
              type="button"
              className={`calendar-cell${cell.current ? '' : ' calendar-cell--muted'}${selected ? ' calendar-cell--selected' : ''}`}
              onClick={() => cell.current && onSelect(new Date(viewYear, viewMonth, cell.day))}
              disabled={!cell.current}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
