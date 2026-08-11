import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import DatePicker from '../components/DatePicker';
import useOnboarding from '../hooks/useOnboarding';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

function Onboarding5() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { endStatus, endDate } = data;

  const isCompleted = endStatus === '보호 종료했어요';
  const label = isCompleted ? '보호 종료일을 알려주세요' : '보호 종료 예정일을 알려주세요';

  const isValid = Boolean(endDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/6');
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
        <ProgressBar step={5} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">{label}</p>

        <DatePicker value={endDate} onChange={(date) => updateData({ endDate: date })} />

        <Button type="submit" className="onboarding-next-btn" disabled={!isValid}>
          다음으로
        </Button>
      </form>
    </div>
  );
}

export default Onboarding5;
