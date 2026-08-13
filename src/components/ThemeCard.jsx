import arrowIcon from '../assets/arrow2_right.svg';
import { THEME_ICONS } from '../constants/themeView';
import '../styles/ThemeCard.css';

function ThemeCard({ icon, title, description, color, badgeLabel, onClick }) {
  return (
    <div className={`theme-card theme-card--${color}`}>
      <div className="theme-card-text">
        {badgeLabel && (
          <span className={`theme-card-badge theme-card-badge--${color}`}>{badgeLabel}</span>
        )}
        <p className="theme-card-title">{title}</p>
        <p className="theme-card-desc">{description}</p>
      </div>
      <img src={THEME_ICONS[icon]} alt="" className="theme-card-icon" />
      <button
        type="button"
        className={`theme-card-arrow theme-card-arrow--${color}`}
        onClick={onClick}
        aria-label="자세히 보기"
      >
        <img src={arrowIcon} alt="" />
      </button>
    </div>
  );
}

export default ThemeCard;
