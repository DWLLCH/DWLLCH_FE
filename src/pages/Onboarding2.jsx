import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import useOnboarding from '../hooks/useOnboarding';
import { SIDO_LIST, SIGUNGU_MAP } from '../constants/regions';
import arrowRight from '../assets/arrow_right.svg';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

function Onboarding2() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { sido, sigungu } = data;

  const sigunguOptions = sido ? SIGUNGU_MAP[sido] || [] : [];

  const handleSidoChange = (value) => {
    updateData({ sido: value, sigungu: '' });
  };

  const isValid = Boolean(sido) && Boolean(sigungu);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/3');
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
        <ProgressBar step={2} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <p className="onboarding-label">거주지역 선택</p>

        <Dropdown
          className="onboarding-dropdown"
          placeholder="시도 선택"
          value={sido}
          options={SIDO_LIST}
          onChange={handleSidoChange}
        />
        <Dropdown
          className="onboarding-dropdown"
          placeholder="시군구 선택"
          value={sigungu}
          options={sigunguOptions}
          onChange={(value) => updateData({ sigungu: value })}
          disabled={!sido}
        />

        <Button type="submit" className="onboarding-next-btn" disabled={!isValid}>
          다음으로
        </Button>
      </form>
    </div>
  );
}

export default Onboarding2;
