import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import ChatbotButton from '../components/ChatbotButton';
import HomeCard from '../components/HomeCard';
import Calendar from '../components/Calendar';
import LoginRequiredModal from '../components/LoginRequiredModal';
import wavingHand from '../assets/waving_hand.svg';
import { getMyProfile } from '../api/mypage';
import { getAccessToken } from '../api/auth';
import { RECRUITMENTS } from '../constants/home';
import { formatDateKey } from '../utils/formatters';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(() => Boolean(getAccessToken()));
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 로그인 상태에서만 쓰는 실제 닉네임
  const [username, setUsername] = useState('');
  const [profileLoading, setProfileLoading] = useState(isLoggedIn);
  const [profileError, setProfileError] = useState(false);

  // TODO: 마이페이지와 마찬가지로 공통 에러 모달이 머지되면 LoginRequiredModal을 그걸로 교체할 것
  const [showLoginModal, setShowLoginModal] = useState(false);

  const selectedKey = formatDateKey(selectedDate);
  const dailyRecruitments = RECRUITMENTS.filter((item) => item.date === selectedKey);

  const fetchProfile = useCallback(() => {
    if (!isLoggedIn) return;
    setProfileLoading(true);
    setProfileError(false);
    getMyProfile()
      .then((data) => {
        setUsername(data.username || '');
      })
      .catch(() => {
        setProfileError(true);
      })
      .finally(() => {
        setProfileLoading(false);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="home">
      <div className="home-scroll">
        <div className="home-greeting">
          {isLoggedIn ? (
            profileError ? (
              <div className="home-banner-error">
                <p>사용자 정보를 불러오지 못했어요</p>
                <button type="button" className="home-retry-btn" onClick={fetchProfile}>
                  다시 시도
                </button>
              </div>
            ) : (
              !profileLoading && (
                <p className="home-greeting-text">
                  안녕하세요, {username}님 <img src={wavingHand} alt="" />
                </p>
              )
            )
          ) : (
            <>
              <p className="home-greeting-text">
                안녕하세요! <img src={wavingHand} alt="" />
              </p>
              <p className="home-greeting-sub">로그인하고 나에게 맞는 지원정보를 찾아보세요.</p>
            </>
          )}
        </div>

        <HomeCard
          theme="green"
          title="제도 한눈에 보기"
          descLines={
            isLoggedIn && username
              ? [`${username}님의 현재 상황을 바탕으로`, '지금 확인할 지원제도를 찾아드려요']
              : ['나에게 필요한 지원제도를', '한눈에 확인해보세요.']
          }
          ctaLabel={isLoggedIn ? '지금 확인하러 가기' : '로그인 후 이용 가능'}
          onClick={() => (isLoggedIn ? navigate('/support/list') : setShowLoginModal(true))}
        />

        <HomeCard
          theme="blue"
          title="AI 맞춤형 지원 제도"
          descLines={
            isLoggedIn && username
              ? [`AI가 ${username}님이 받을 수 있는`, '지원제도를 꼼꼼하게 찾아드려요']
              : ['내 상황에 맞는 지원지도를', 'AI가 찾아드려요.']
          }
          ctaLabel={isLoggedIn ? '지금 확인하러 가기' : '로그인 후 이용 가능'}
          onClick={() => (isLoggedIn ? navigate('/theme') : setShowLoginModal(true))}
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

      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

export default Home;
