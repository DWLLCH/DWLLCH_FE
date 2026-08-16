import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import ChatbotButton from '../components/ChatbotButton';
import HomeCard from '../components/HomeCard';
import Calendar from '../components/Calendar';
import wavingHand from '../assets/waving_hand.svg';
import { CURRENT_USER_NAME, RECRUITMENTS } from '../constants/home';
import { formatDateKey } from '../utils/formatters';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedKey = formatDateKey(selectedDate);
  const dailyRecruitments = RECRUITMENTS.filter((item) => item.date === selectedKey);

  return (
    <div className="home">
      <div className="home-scroll">
        <div className="home-greeting">
          <p>
            안녕하세요, {CURRENT_USER_NAME}님 <img src={wavingHand} alt="" />
          </p>
        </div>

        <HomeCard
          theme="green"
          title="제도 한눈에 보기"
          descLines={[
            `${CURRENT_USER_NAME}님의 현재 상황을 바탕으로`,
            '지금 확인할 지원제도를 찾아드려요',
          ]}
          onClick={() => navigate('/support/list')}
        />

        <HomeCard
          theme="blue"
          title="AI 맞춤형 지원 제도"
          descLines={[
            `AI가 ${CURRENT_USER_NAME}님이 받을 수 있는`,
            '지원제도를 꼼꼼하게 찾아봤어요',
          ]}
          onClick={() => navigate('/theme')}
        />

        <div className="home-calendar-card">
          <Calendar value={selectedDate} onSelect={setSelectedDate} inline />
        </div>

        <div className="home-recruit-section">
          <div className="home-recruit-legend">
            <span className="home-recruit-dot home-recruit-dot--start" />
            모집시작
            <span className="home-recruit-dot home-recruit-dot--end" />
            모집마감
          </div>

          <ul className="home-recruit-list">
            {dailyRecruitments.length === 0 && (
              <li className="home-recruit-empty">해당 날짜에 공고가 없어요</li>
            )}
            {dailyRecruitments.map((item) => (
              <li key={item.title}>
                <span
                  className={`home-recruit-dot home-recruit-dot--${item.type === 'start' ? 'start' : 'end'}`}
                />
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ChatbotButton onClick={() => navigate('/chatbot')} />
      <BottomNav />
    </div>
  );
}

export default Home;
