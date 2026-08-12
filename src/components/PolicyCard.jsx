import fitnessHigh from '../assets/fitness_high.svg';
import fitnessMid from '../assets/fitness_mid.svg';
import fitnessLow from '../assets/fitness_low.svg';
import ActionButton from './ActionButton';
import '../styles/PolicyCard.css';

const LEVEL_CONFIG = {
  high: { label: '높음', bg: '#ecf8f1', color: '#6cd59b', icon: fitnessHigh },
  mid: { label: '보통', bg: '#dce5ff', color: '#597ce4', icon: fitnessMid },
  low: { label: '낮음', bg: '#fff5d6', color: '#ffc107', icon: fitnessLow },
};

function PolicyCard({ level, dday, title, onClick }) {
  const config = LEVEL_CONFIG[level];

  return (
    <li className="policy-card">
      <div className="policy-card-top">
        <span
          className="policy-card-fit"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          <img src={config.icon} alt="" />
          AI 예상 적합도 {config.label}
        </span>
        <span
          className="policy-card-dday"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          {dday}
        </span>
      </div>

      <p className="policy-card-title">{title}</p>

      <div className="policy-card-bottom">
        <p className="policy-card-desc">
          현재 입력하신 정보 기준
          <br />
          주요 요건을 충족해요
        </p>
        <ActionButton label="자세히 보기" filled onClick={onClick} />
      </div>
    </li>
  );
}

export default PolicyCard;
