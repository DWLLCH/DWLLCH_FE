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

// briefing-marquee-viewport(overflow-x: auto)에 붙는 핸들러. briefing-card-row는 자동으로
// 흘러가는 마퀴라 터치/마우스로 만지는 동안은 잠깐 멈추고, 뷰포트의 네이티브 스크롤(터치)이나
// 마우스 드래그(desktop, overflow-x:auto만으론 마우스 클릭드래그 패닝이 안 돼서 직접 구현)로
// 좌우 이동을 받아줌 (React 19 ref 콜백의 정리 함수 반환을 이용, 훅 없이 DOM 노드에 직접 붙임)
function attachMarqueeInteraction(viewport) {
  if (!viewport) return undefined;
  const row = viewport.querySelector('.briefing-card-row');
  if (!row) return undefined;

  const pause = () => row.classList.add('is-paused');
  const resume = () => row.classList.remove('is-paused');

  // 카드가 두 벌 이어붙여진 트랙이라(-50% 지점이 정확히 "한 벌"의 끝), 오른쪽 끝까지 스크롤해서
  // 두 번째 벌 안으로 들어가면 몰래 한 벌만큼 되감아서(scrollLeft -= half) 첫 벌로 이어붙임 -
  // 두 벌 다 내용이 같아서 사용자 눈에는 끊김 없이 계속 원형으로 도는 것처럼 보임
  const loopScroll = () => {
    const halfWidth = row.scrollWidth / 2;
    if (halfWidth <= 0) return;
    while (viewport.scrollLeft >= halfWidth) {
      viewport.scrollLeft -= halfWidth;
    }
  };

  let dragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  const handlePointerDown = (e) => {
    // 터치는 뷰포트의 네이티브 스크롤에 맡기고, 마우스/펜만 직접 드래그 패닝을 처리함
    if (e.pointerType === 'touch') return;
    dragging = true;
    startX = e.clientX;
    startScrollLeft = viewport.scrollLeft;
    pause();
    viewport.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (!dragging) return;
    viewport.scrollLeft = startScrollLeft - (e.clientX - startX);
  };
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    resume();
    if (e?.pointerId != null) viewport.releasePointerCapture(e.pointerId);
  };

  // 세로 휠(deltaX === 0)만 굴려도 좌우로 스크롤되게 deltaY를 scrollLeft에 대신 반영함
  // (트랙패드 가로 스와이프나 Shift+휠처럼 이미 deltaX가 있는 경우는 브라우저 네이티브 동작 그대로 둠)
  let wheelResumeTimer = null;
  const handleWheel = (e) => {
    if (e.deltaX !== 0) return;
    e.preventDefault();
    pause();
    viewport.scrollLeft += e.deltaY;
    clearTimeout(wheelResumeTimer);
    wheelResumeTimer = setTimeout(resume, 200);
  };

  viewport.addEventListener('scroll', loopScroll, { passive: true });
  viewport.addEventListener('touchstart', pause, { passive: true });
  viewport.addEventListener('touchend', resume);
  viewport.addEventListener('touchcancel', resume);
  viewport.addEventListener('pointerdown', handlePointerDown);
  viewport.addEventListener('pointermove', handlePointerMove);
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('wheel', handleWheel, { passive: false });

  return () => {
    clearTimeout(wheelResumeTimer);
    viewport.removeEventListener('scroll', loopScroll);
    viewport.removeEventListener('touchstart', pause);
    viewport.removeEventListener('touchend', resume);
    viewport.removeEventListener('touchcancel', resume);
    viewport.removeEventListener('pointerdown', handlePointerDown);
    viewport.removeEventListener('pointermove', handlePointerMove);
    viewport.removeEventListener('pointerup', endDrag);
    viewport.removeEventListener('pointercancel', endDrag);
    viewport.removeEventListener('wheel', handleWheel);
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
                <div className="briefing-marquee-viewport" ref={attachMarqueeInteraction}>
                  <div className="briefing-card-row">
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
