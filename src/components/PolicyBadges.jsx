import { LEVEL_CONFIG } from '../constants/supportList';
import '../styles/PolicyBadges.css';

function PolicyBadges({ level, dday }) {
  const config = LEVEL_CONFIG[level];

  return (
    <div className="policy-badges">
      <span
        className="policy-badge-fit"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        <img src={config.icon} alt="" />
        AI 예상 적합도 {config.label}
      </span>
      <span
        className="policy-badge-dday"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {dday}
      </span>
    </div>
  );
}

export default PolicyBadges;
