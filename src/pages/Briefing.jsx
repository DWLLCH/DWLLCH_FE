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

// briefing-card-row는 이제 자동으로 흘러가는 마퀴라 트랙 자체엔 스크롤이 없음.
// 데스크톱은 CSS :has(:hover)로 정지시키지만 터치는 hover가 안 잡혀서, 손가락이 닿아있는
// 동안만 흐름을 멈추도록 touchstart/touchend에 직접 리스너를 붙였다 뗌
// (React 19 ref 콜백의 정리 함수 반환을 이용, 훅 없이 DOM 노드에 직접 붙임)
function attachTouchPause(node) {
  if (!node) return undefined;

  const pause = () => node.classList.add('is-paused');
  const resume = () => node.classList.remove('is-paused');

  node.addEventListener('touchstart', pause, { passive: true });
  node.addEventListener('touchend', resume);
  node.addEventListener('touchcancel', resume);

  return () => {
    node.removeEventListener('touchstart', pause);
    node.removeEventListener('touchend', resume);
    node.removeEventListener('touchcancel', resume);
  };
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
                <div className="briefing-marquee-viewport">
                  <div className="briefing-card-row" ref={attachTouchPause}>
                    {/* 카드 목록을 두 벌 이어붙여서 트랙이 -50% 만큼 흘러가면 이음매 없이 반복되게 함 */}
                    {[...section.cards, ...section.cards].map((briefing, index) => (
                      <div
                        className="briefing-card-float"
                        key={`${briefing.id}-${index}`}
                        style={{ animationDelay: `${(index % section.cards.length) * 0.3}s` }}
                      >
                        <BriefingCard
                          color={briefing.color}
                          icon={briefing.icon}
                          title={briefing.title}
                          onClick={() => navigate(`/ai-briefing/${briefing.id}`)}
                        />
                      </div>
                    ))}
                  </div>
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
