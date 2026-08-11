import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import OptionChip from '../components/OptionChip';
import useOnboarding from '../hooks/useOnboarding';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

const END_STATUSES = ['아직 보호 중이에요', '보호 종료 예정이에요', '보호 종료했어요'];

function Onboarding4() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { endStatus } = data;

  const isValid = Boolean(endStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate(endStatus === '아직 보호 중이에요' ? '/onboarding/6' : '/onboarding/5');
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
        <ProgressBar step={4} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">현재 보호종료 상태</p>

        <div className="onboarding-chip-grid">
          {END_STATUSES.map((status) => (
            <OptionChip
              key={status}
              label={status}
              selected={endStatus === status}
              onClick={() => {
                if (endStatus !== status) {
                  updateData({ endStatus: status, endDate: null });
                }
              }}
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

export default Onboarding4;
