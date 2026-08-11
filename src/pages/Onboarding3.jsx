import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import OptionChip from '../components/OptionChip';
import useOnboarding from '../hooks/useOnboarding';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

const PROTECTION_TYPES = ['아동양육시설', '공동생활가정', '가정위탁', '기타', '잘 모르겠어요'];

function Onboarding3() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { protectionType } = data;

  const isValid = Boolean(protectionType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/4');
  };

  return (
    <div className="onboarding">
      <header className="onboarding-header">
        <button
          type="button"
          className="onboarding-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={arrowRight} alt="" />
        </button>
        <h1>프로필 생성</h1>
      </header>

      <div className="onboarding-progress-wrap">
        <ProgressBar step={3} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">보호 이력</p>
        <p className="onboarding-helper">가장 최근에 보호받았던 유형을 선택해주세요.</p>

        <div className="onboarding-chip-grid">
          {PROTECTION_TYPES.map((type) => (
            <OptionChip
              key={type}
              label={type}
              selected={protectionType === type}
              onClick={() => updateData({ protectionType: type })}
            />
          ))}
        </div>

        <Button type="submit" className="onboarding-next-btn" disabled={!isValid}>
          다음으로
        </Button>
      </form>
    </div>
  );
}

export default Onboarding3;
