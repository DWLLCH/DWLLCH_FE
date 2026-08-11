import googleLogo from '../assets/logo_google.svg';
import '../styles/SocialLoginButton.css';

function SocialLoginButton({ label, onClick }) {
  return (
    <button type="button" className="social-login-btn" onClick={onClick}>
      <img src={googleLogo} alt="" className="social-login-icon" />
      <span>{label}</span>
    </button>
  );
}

export default SocialLoginButton;
