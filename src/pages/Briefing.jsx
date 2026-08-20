import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import BriefingCard from '../components/BriefingCard';
import SectionTag from '../components/SectionTag';
import BottomNav from '../components/BottomNav';
import ChatbotButton from '../components/ChatbotButton';
import LoginRequiredModal from '../components/LoginRequiredModal';
import OnboardingRequiredModal from '../components/OnboardingRequiredModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import useOnboardingComplete from '../hooks/useOnboardingComplete';
import { getAccessToken } from '../api/auth';
import { getBriefings } from '../api/briefing';
import { BRIEFING_SECTION_META } from '../constants/briefing';
import '../styles/Briefing.css';

// briefing-card-row는 overflow-x: auto라 트랙패드/드래그로는 가로 스크롤이 되지만,
// 일반 마우스 휠(세로 입력)로는 안 움직여서 세로 휠 입력을 가로 스크롤로 바꿔줌
// (React 19 ref 콜백의 정리 함수 반환을 이용, 훅 없이 DOM 노드에 직접 리스너를 붙였다 뗌)
function attachHorizontalWheelScroll(node) {
  if (!node) return undefined;

  const handleWheel = (event) => {
    // 이미 가로 입력(트랙패드 가로 스와이프 등)이면 그대로 두고, 세로 입력일 때만 가로로 바꿔줌
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    node.scrollLeft += event.deltaY;
  };

  node.addEventListener('wheel', handleWheel, { passive: false });
  return () => node.removeEventListener('wheel', handleWheel);
}

function Briefing() {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(() => Boolean(getAccessToken()));
  const { status: onboardingStatus } = useOnboardingComplete();
  const onboardingChecking = isLoggedIn && onboardingStatus === 'checking';
  const onboardingBlocked =
    isLoggedIn && (onboardingStatus === 'incomplete' || onboardingStatus === 'error');
  const canFetch = isLoggedIn && !onboardingChecking && !onboardingBlocked;

  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBriefings = useCallback(() => {
    setLoading(true);
    setError(null);
    getBriefings()
      .then((data) => setBriefings(data.content ?? []))
      .catch(() => setError('브리핑 목록을 불러오지 못했어요'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!canFetch) return;
    loadBriefings();
  }, [canFetch, loadBriefings]);

  const sections = BRIEFING_SECTION_META.map((meta) => ({
    ...meta,
    cards: briefings.filter((briefing) => briefing.category === meta.category),
  }));
  const showLoading = onboardingChecking || (canFetch && loading);

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
        {showLoading && (
          <div className="briefing-loading">
            <LoadingSpinner />
          </div>
        )}

        {!showLoading && error && <ErrorState message={error} onRetry={loadBriefings} />}

        {!showLoading &&
          !error &&
          sections.map((section) => (
            <section className="briefing-section" key={section.id}>
              <SectionTag>{section.title}</SectionTag>
              <p className="briefing-section-desc">{section.description}</p>
              {section.cards.length > 0 ? (
                <div className="briefing-card-row" ref={attachHorizontalWheelScroll}>
                  {section.cards.map((briefing) => (
                    <BriefingCard
                      key={briefing.id}
                      color={briefing.color}
                      icon={briefing.icon}
                      title={briefing.title}
                      onClick={() => navigate(`/ai-briefing/${briefing.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <p className="briefing-empty">아직 준비된 브리핑이 없어요</p>
              )}
            </section>
          ))}
      </div>

      <ChatbotButton onClick={() => navigate('/chatbot')} />
      <BottomNav />

      <LoginRequiredModal open={!isLoggedIn} onClose={() => navigate('/home')} />
      <OnboardingRequiredModal open={onboardingBlocked} onClose={() => navigate('/home')} />
    </div>
  );
}

export default Briefing;
