import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import BriefingCard from '../components/BriefingCard';
import SectionTag from '../components/SectionTag';
import BottomNav from '../components/BottomNav';
import ChatbotButton from '../components/ChatbotButton';
import { BRIEFING_SECTIONS } from '../constants/briefing';
import '../styles/Briefing.css';

function Briefing() {
  const navigate = useNavigate();

  return (
    <div className="briefing-page">
      <header className="briefing-header">
        <button
          type="button"
          className="briefing-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>AI 브리핑</h1>
      </header>

      <div className="briefing-body">
        {BRIEFING_SECTIONS.map((section) => (
          <section className="briefing-section" key={section.id}>
            <SectionTag>{section.title}</SectionTag>
            <p className="briefing-section-desc">{section.description}</p>
            <div className="briefing-card-row">
              {section.cards.map((card) => (
                <BriefingCard
                  key={card.id}
                  color={card.color}
                  icon={card.icon}
                  title={card.title}
                  onClick={() => navigate(`/ai-briefing/${section.id}/${card.id}`)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <ChatbotButton onClick={() => navigate('/chatbot')} />
      <BottomNav />
    </div>
  );
}

export default Briefing;
