import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import OptionChip from '../components/OptionChip';
import useOnboarding from '../hooks/useOnboarding';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;
const MAX_SELECTION = 3;

const SUPPORT_NEEDS = [
  '주거 (집을 구하거나 주거비 지원이 필요해요)',
  '금융·생활비 (돈 관리나 생활비 지원이 필요해요)',
  '취업·진로 (일자리나 진로 정보가 필요해요)',
  '교육 (학업이나 교육비 지원이 필요해요)',
  '지원제도 (내가 받을 수 있는 지원을 찾고 싶어요)',
  '행정·서류 (신청이나 서류 준비가 어려워요)',
  '상담·도움 (누군가에게 상담을 받고 싶어요)',
];

function Onboarding11() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { supportNeeds } = data;

  const isValid = supportNeeds.length > 0;

  const toggleNeed = (item) => {
    if (supportNeeds.includes(item)) {
      updateData({ supportNeeds: supportNeeds.filter((value) => value !== item) });
    } else if (supportNeeds.length < MAX_SELECTION) {
      updateData({ supportNeeds: [...supportNeeds, item] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/complete');
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
        <ProgressBar step={11} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">지금 가장 필요한 도움이 무엇인가요?</p>
        <p className="onboarding-helper">최대 3개까지 선택해주세요.</p>

        <div className="onboarding-option-list">
          {SUPPORT_NEEDS.map((item) => {
            const selected = supportNeeds.includes(item);
            return (
              <OptionChip
                key={item}
                label={item}
                fullWidth
                selected={selected}
                disabled={!selected && supportNeeds.length >= MAX_SELECTION}
                onClick={() => toggleNeed(item)}
              />
            );
          })}
        </div>

        <Button type="submit" className="onboarding-next-btn" disabled={!isValid}>
          다음으로
        </Button>
      </form>
    </div>
  );
}

export default Onboarding11;
