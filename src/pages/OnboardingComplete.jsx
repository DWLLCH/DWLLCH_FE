import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import logoImage from '../assets/logo_image.svg';
import '../styles/Onboarding.css';
import '../styles/OnboardingComplete.css';

const TOTAL_STEPS = 11;

function OnboardingComplete() {
  const navigate = useNavigate();

  return (
    <div className="onboarding">
      <header className="onboarding-header">
        <h1>프로필 생성</h1>
      </header>

      <div className="onboarding-progress-wrap">
        <ProgressBar step={TOTAL_STEPS} total={TOTAL_STEPS} celebrate />
      </div>

      <div className="onboarding-complete-body">
        <p className="onboarding-complete-title">프로필 생성이 완료되었습니다!</p>

        <img src={logoImage} alt="로고" className="onboarding-complete-logo" />

        <p className="onboarding-complete-desc">
          이제 <span className="onboarding-complete-brand">Fledge</span>와 함께 시작해볼까요?
        </p>

        <Button className="onboarding-next-btn" onClick={() => navigate('/home')}>
          나에게 맞는 지원 확인하기
        </Button>
      </div>
    </div>
  );
}

export default OnboardingComplete;
