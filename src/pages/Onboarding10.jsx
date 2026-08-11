import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import OptionChip from '../components/OptionChip';
import useOnboarding from '../hooks/useOnboarding';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

const GRID_SUPPORTS = [
  '자립정착금',
  '취업 지원',
  '자립수당',
  '생활비 지원',
  '주거지원',
  '금융 지원',
  '교육·장학 지원',
  '기타',
];

const EXTRA_SUPPORTS = ['잘 모르겠어요', '현재 받고 있는 지원이 없어요'];

function Onboarding10() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { currentSupports } = data;

  const isValid = currentSupports.length > 0;

  const toggleSupport = (item) => {
    updateData({
      currentSupports: currentSupports.includes(item)
        ? currentSupports.filter((value) => value !== item)
        : [...currentSupports, item],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/11');
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
        <ProgressBar step={10} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">현재 받고 있는 지원이 있나요?</p>
        <p className="onboarding-helper">있다면 모두 선택해주세요.</p>

        <div className="onboarding-chip-grid">
          {GRID_SUPPORTS.map((item) => (
            <OptionChip
              key={item}
              label={item}
              selected={currentSupports.includes(item)}
              onClick={() => toggleSupport(item)}
            />
          ))}
        </div>

        <div className="onboarding-option-list">
          {EXTRA_SUPPORTS.map((item) => (
            <OptionChip
              key={item}
              label={item}
              fullWidth
              selected={currentSupports.includes(item)}
              onClick={() => toggleSupport(item)}
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

export default Onboarding10;
