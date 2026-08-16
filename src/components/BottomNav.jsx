import { NavLink } from 'react-router-dom';
import home from '../assets/home.svg';
import community from '../assets/community.svg';
import briefing from '../assets/briefing.svg';
import bookmark from '../assets/bookmark.svg';
import mypage from '../assets/mypage.svg';
import '../styles/BottomNav.css';

const NAV_ITEMS = [
  { path: '/home', icon: home, label: '홈', iconClass: 'bottom-nav-icon--home' },
  {
    path: '/community',
    icon: community,
    label: '커뮤니티',
    iconClass: 'bottom-nav-icon--community',
  },
  {
    path: '/ai-briefing',
    icon: briefing,
    label: 'AI브리핑',
    iconClass: 'bottom-nav-icon--briefing',
  },
  { path: '/bookmark', icon: bookmark, label: '북마크', iconClass: 'bottom-nav-icon--bookmark' },
  { path: '/mypage', icon: mypage, label: '마이페이지', iconClass: 'bottom-nav-icon--mypage' },
];

function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `bottom-nav-item${isActive ? ' bottom-nav-item--active' : ''}`
          }
        >
          <span className="bottom-nav-icon-wrap">
            <span
              className={`bottom-nav-icon ${item.iconClass}`}
              style={{ maskImage: `url(${item.icon})`, WebkitMaskImage: `url(${item.icon})` }}
            />
          </span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
