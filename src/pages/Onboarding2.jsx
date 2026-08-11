import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { SIDO_LIST, SIGUNGU_MAP } from '../constants/regions';
import '../styles/Onboarding.css';

const TOTAL_STEPS = 11;

function Onboarding2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');

  const sigunguOptions = sido ? SIGUNGU_MAP[sido] || [] : [];

  const handleSidoChange = (value) => {
    setSido(value);
    setSigungu('');
  };

  const isValid = Boolean(sido) && Boolean(sigungu);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate('/onboarding/3', { state: { ...location.state, sido, sigungu } });
  };

  return (
    <div className="onboarding">
      <header className="onboarding-header">
        <h1>프로필 생성</h1>
      </header>

      <div className="onboarding-progress-wrap">
        <ProgressBar step={2} total={TOTAL_STEPS} />
      </div>

      <form className="onboarding-body" onSubmit={handleSubmit}>
        <span className="onboarding-label">거주지역 선택</span>

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
          onChange={setSigungu}
          disabled={!sido}
        />

        <Button type="submit" fullWidth disabled={!isValid}>
          다음으로
        </Button>
      </form>
    </div>
  );
}

export default Onboarding2;
