import PolicyBadges from './PolicyBadges';
import ActionButton from './ActionButton';
import '../styles/PolicyCard.css';

function PolicyCard({ level, dday, title, description, onClick }) {
  return (
    <li className="policy-card">
      <PolicyBadges level={level} dday={dday} />

      <p className="policy-card-title">{title}</p>

      <div className="policy-card-bottom">
        <p className="policy-card-desc">
          {description || '자세히 보기에서 지원 자격을 확인해보세요'}
        </p>
        <ActionButton label="자세히 보기" filled onClick={onClick} />
      </div>
    </li>
  );
}

export default PolicyCard;
