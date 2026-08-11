import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import OptionChip from '../components/OptionChip';
import useOnboarding from '../hooks/useOnboarding';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

const HOUSING_TYPES = [
  '월세 (보증금과 월 임대료를 내고 있어요)',
  '전세 (전세보증금을 내고 살아요)',
  '자가 (본인 소유의 집에서 살고 있어요)',
  '무상 거주 (가족이나 지인의 집에서 살고 있어요)',
  '시설·그룹홈 등',
];

function Onboarding6() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { housing } = data;

  const isValid = Boolean(housing);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/7');
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
        <ProgressBar step={6} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">주거 (현재 어디에 살고 있나요?)</p>

        <div className="onboarding-option-list">
          {HOUSING_TYPES.map((type) => (
            <OptionChip
              key={type}
              label={type}
              fullWidth
              selected={housing === type}
              onClick={() => updateData({ housing: type })}
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

export default Onboarding6;
