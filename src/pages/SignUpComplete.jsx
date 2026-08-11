import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import logoImage from '../assets/logo_image.svg';
import '../styles/SignUpComplete.css';

const BENEFITS = [
  '내 상황에 맞는 지원사업 추천',
  '신청 가능성 확인',
  '필요한 서류 안내',
  '신청 마감 알림',
];

function SignUpComplete() {
  const navigate = useNavigate();

  return (
    <div className="signup-complete">
      <header className="signup-complete-header">
        <h1>회원가입</h1>
      </header>

      <div className="signup-complete-body">
        <img src={logoImage} alt="로고" className="signup-complete-logo" />

        <p className="signup-complete-title">
          <span className="signup-complete-title-brand">Fledge</span>에 오신 것을 환영해요!
        </p>

        <p className="signup-complete-desc">
          이제 Fledge가 나에게 맞는
          <br />
          지원정보를 찾아드릴 수 있어요.
        </p>

        <div className="signup-complete-box">
          <p className="signup-complete-box-title">자립 프로필을 만들면</p>
          <ul className="signup-complete-benefits">
            {BENEFITS.map((benefit, index) => (
              <li
                key={benefit}
                className="signup-complete-benefit"
                style={{ animationDelay: `${2.9 + index * 0.45}s` }}
              >
                <span className="signup-complete-check" />
                {benefit}
              </li>
            ))}
          </ul>
          <p className="signup-complete-box-footer">등의 다양한 서비스를 받을 수 있어요.</p>
        </div>
      </div>

      <div className="signup-complete-actions">
        <Button fullWidth variant="blue" onClick={() => navigate('/onboarding/1')}>
          자립 프로필 만들기
        </Button>
        <Button fullWidth variant="gray">
          나중에 할게요
        </Button>
      </div>
    </div>
  );
}

export default SignUpComplete;
