import PolicyBadges from './PolicyBadges';
import ActionButton from './ActionButton';
import '../styles/PolicyCard.css';

function PolicyCard({ level, dday, title, onClick }) {
  return (
    <li className="policy-card">
      <PolicyBadges level={level} dday={dday} />

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
