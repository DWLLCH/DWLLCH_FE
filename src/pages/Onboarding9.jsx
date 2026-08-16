import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import OptionChip from '../components/OptionChip';
import useOnboarding from '../hooks/useOnboarding';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

const INCOME_TYPES = [
  '근로소득 (직장, 아르바이트, 파트타임 등)',
  '사업소득 (프리랜서, 자영업, 플랫폼 노동 등)',
  '기타·재산소득 (이자, 임대소득 등)',
  '현재 소득이 없어요 (미취업, 취업준비 등)',
];

function Onboarding9() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { incomeType } = data;

  const isValid = Boolean(incomeType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/10');
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
        <ProgressBar step={9} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">현재 소득은 어떤 형태인가요?</p>

        <div className="onboarding-option-list">
          {INCOME_TYPES.map((type) => (
            <OptionChip
              key={type}
              label={type}
              fullWidth
              selected={incomeType === type}
              onClick={() => updateData({ incomeType: type })}
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

export default Onboarding9;
