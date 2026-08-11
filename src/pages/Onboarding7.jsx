import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import OptionChip from '../components/OptionChip';
import useOnboarding from '../hooks/useOnboarding';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

const HOUSING_SITUATIONS = [
  '안정적으로 거주하고 있어요',
  '이사할 집을 찾고 있어요',
  '독립할 집을 찾고 있어요',
  '주거비가 부담스러워요',
  '곧 보호종료라 주거를 준비해야 해요',
  '아직 잘 모르겠어요',
];

function Onboarding7() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { housingSituation } = data;

  const isValid = Boolean(housingSituation);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/8');
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
        <ProgressBar step={7} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">지금 주거와 관련해 어떤 상황인가요?</p>

        <div className="onboarding-option-list">
          {HOUSING_SITUATIONS.map((situation) => (
            <OptionChip
              key={situation}
              label={situation}
              fullWidth
              selected={housingSituation === situation}
              onClick={() => updateData({ housingSituation: situation })}
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

export default Onboarding7;
