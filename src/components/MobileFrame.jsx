import { Outlet } from 'react-router-dom';
import '../styles/MobileFrame.css';

function MobileFrame() {
  return (
    <div className="mobile-frame">
      <Outlet />
    </div>
  );
}

export default MobileFrame;
