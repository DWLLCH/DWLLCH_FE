import { BRIEFING_ICONS, BRIEFING_BOX_IMAGES } from '../constants/briefing';
import '../styles/BriefingCard.css';

// color/icon 기본값은 BE Briefing 모델 기본값(blue/document)과 맞춤
function BriefingCard({ color = 'blue', icon = 'document', title, onClick }) {
  return (
    <div className="briefing-card">
      <img src={BRIEFING_BOX_IMAGES[color]} alt="" className="briefing-card-box" />
      <img src={BRIEFING_ICONS[icon]} alt="" className="briefing-card-icon" />
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
