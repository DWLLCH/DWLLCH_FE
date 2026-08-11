import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import OptionChip from '../components/OptionChip';
import useOnboarding from '../hooks/useOnboarding';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

const LIFESTYLES = [
  '학교에 다니고 있어요',
  '직장에 다니고 있어요',
  '아르바이트·파트타임으로 일하고 있어요',
  '프리랜서·플랫폼 노동을 하고 있어요',
  '자영업·창업을 하고 있어요',
  '취업을 준비하고 있어요',
  '현재 하고 있는 일이 없어요',
];

function Onboarding8() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { lifestyle } = data;

  const isValid = lifestyle.length > 0;

  const toggleLifestyle = (item) => {
    updateData({
      lifestyle: lifestyle.includes(item)
        ? lifestyle.filter((value) => value !== item)
        : [...lifestyle, item],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/9');
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
        <ProgressBar step={8} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">지금 어떤 생활을 하고 있나요?</p>
        <p className="onboarding-helper">학교와 일을 병행하고 있다면 여러 개를 선택해주세요.</p>

        <div className="onboarding-option-list">
          {LIFESTYLES.map((item) => (
            <OptionChip
              key={item}
              label={item}
              fullWidth
              selected={lifestyle.includes(item)}
              onClick={() => toggleLifestyle(item)}
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

export default Onboarding8;
