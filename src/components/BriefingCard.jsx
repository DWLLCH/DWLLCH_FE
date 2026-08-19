import { BRIEFING_ICONS, BRIEFING_BOX_IMAGES } from '../constants/briefing';
import '../styles/BriefingCard.css';

// color/icon 기본값은 BE Briefing 모델 기본값(blue/document)과 맞춤
// BE가 매핑에 없는 값을 내려줄 수도 있어서, 지원하지 않는 값이면 기본값으로 대체함 (깨진 이미지 방지)
function BriefingCard({ color, icon, title, onClick }) {
  const resolvedColor = Object.prototype.hasOwnProperty.call(BRIEFING_BOX_IMAGES, color)
    ? color
    : 'blue';
  const resolvedIcon = Object.prototype.hasOwnProperty.call(BRIEFING_ICONS, icon)
    ? icon
    : 'document';

  return (
    <div className="briefing-card">
      <img src={BRIEFING_BOX_IMAGES[resolvedColor]} alt="" className="briefing-card-box" />
      <img src={BRIEFING_ICONS[resolvedIcon]} alt="" className="briefing-card-icon" />
      <div className="briefing-card-content">
        <div className="briefing-card-title-wrap">
          <p className="briefing-card-title">{title}</p>
        </div>
        <button type="button" className="briefing-card-btn" onClick={onClick}>
          바로가기
        </button>
      </div>
    </div>
  );
}

export default BriefingCard;
