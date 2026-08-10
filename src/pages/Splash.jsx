import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo_image.svg';
import '../styles/Splash.css';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

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
