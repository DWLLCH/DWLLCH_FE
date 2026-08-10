import logoImage from '../assets/logo_image.svg';
import '../styles/Splash.css';

function Splash() {
  return (
    <div className="splash">
      {/* 로고 */}
      <div className="splash-logo-wrap">
        <img src={logoImage} alt="로고" className="splash-logo" />
      </div>
      {/* 로딩 인디케이터 */}
      <div className="splash-loading">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default Splash;
