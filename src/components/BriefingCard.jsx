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
    // 카드 전체가 클릭 영역이라 실제 button으로 만들어야 키보드로도 포커스/활성화가 됨(div는 안 됨)
    // "바로가기"는 시각적 CTA일 뿐 별도 상호작용이 없어서 button을 중첩하지 않고 span으로 둠
    <button type="button" className="briefing-card" onClick={onClick}>
      <img src={BRIEFING_BOX_IMAGES[resolvedColor]} alt="" className="briefing-card-box" />
      <img src={BRIEFING_ICONS[resolvedIcon]} alt="" className="briefing-card-icon" />
      <div className="briefing-card-content">
        <div className="briefing-card-title-wrap">
          <p className="briefing-card-title">{title}</p>
        </div>
        <span className="briefing-card-btn">바로가기</span>
      </div>
    </button>
  );
}

export default BriefingCard;
