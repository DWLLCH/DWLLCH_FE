import { useEffect, useState } from 'react';
import infoIcon from '../assets/info.svg';
import { AI_SORT_INFO } from '../constants/filterOptions';
import '../styles/SortMenu.css';

function SortMenu({ open, value, options, onSelect }) {
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (!open) setInfoOpen(false);
  }, [open]);

  return (
    <div className="sort-menu">
      {options.map((option) => {
        const isSelected = value === option;
        const isAiRecommend = option === 'AI 추천순';

        return (
          <div key={option} className="sort-menu-row">
            <div className={`sort-menu-item${isSelected ? ' sort-menu-item--selected' : ''}`}>
              {isAiRecommend ? (
                <>
                  <button
                    type="button"
                    className="sort-menu-hit"
                    aria-label={option}
                    aria-pressed={isSelected}
                    onClick={() => onSelect(option)}
                  />
                  <div className="sort-menu-option-content">
                    <span>{option}</span>
                    <button
                      type="button"
                      className="sort-info-icon"
                      aria-label="AI 추천순 설명 보기"
                      aria-expanded={infoOpen}
                      onClick={() => setInfoOpen((prev) => !prev)}
                    >
                      <img src={infoIcon} alt="" />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="sort-menu-option"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(option)}
                >
                  {option}
                </button>
              )}
            </div>

            {isAiRecommend && infoOpen && (
              <div className="sort-info-panel">
                <p className="sort-info-title">{AI_SORT_INFO.title}</p>
                <p className="sort-info-desc">{AI_SORT_INFO.description}</p>
                <p className="sort-info-title">{AI_SORT_INFO.criteriaTitle}</p>
                <p className="sort-info-desc">{AI_SORT_INFO.criteria}</p>
                <p className="sort-info-note">{AI_SORT_INFO.note}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SortMenu;
