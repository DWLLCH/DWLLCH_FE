import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import ThemeGroup from '../components/ThemeGroup';
import ChatbotButton from '../components/ChatbotButton';
import { THEME_GROUPS } from '../constants/themeView';
import '../styles/ThemeView.css';

function ThemeView() {
  const navigate = useNavigate();

  return (
    <div className="theme-page">
      <header className="theme-header">
        <button
          type="button"
          className="theme-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>테마별 보기</h1>
      </header>

      <div className="theme-body">
        {THEME_GROUPS.map((group) => (
          <ThemeGroup
            key={group.id}
            title={group.title}
            color={group.color}
            cards={group.cards}
            onCardClick={(id) => navigate(`/support/${id}`)}
          />
        ))}
      </div>

      <ChatbotButton />
    </div>
  );
}

export default ThemeView;
