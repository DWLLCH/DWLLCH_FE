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

// CSS 애니메이션과 네이티브 스크롤이 서로 안 섞여서, 만지는 동안만 애니메이션을 멈추고 스크롤을 받아줌
function attachMarqueeInteraction(viewport) {
  if (!viewport) return undefined;
  const row = viewport.querySelector('.briefing-card-row');
  if (!row) return undefined;

  const pause = () => row.classList.add('is-paused');
  const resume = () => row.classList.remove('is-paused');

  // 카드가 두 벌 이어붙은 트랙이라 두 번째 벌에 들어가면 한 벌만큼 되감아 순환처럼 보이게 함
  const loopScroll = () => {
    const halfWidth = row.scrollWidth / 2;
    if (halfWidth <= 0) return;
    while (viewport.scrollLeft >= halfWidth) {
      viewport.scrollLeft -= halfWidth;
    }
  };

  let drag = null;
  const DRAG_THRESHOLD = 4;

  const handlePointerDown = (e) => {
    if (e.pointerType === 'touch') return;
    drag = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: viewport.scrollLeft,
      moved: false,
    };
  };
  const handlePointerMove = (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      // pointerdown 즉시 캡처하면 click도 뷰포트로 뺏겨 카드 클릭이 막혀서 이동 후에만 캡처함
      drag.moved = true;
      pause();
      viewport.setPointerCapture(drag.pointerId);
    }
    viewport.scrollLeft = drag.startScrollLeft - dx;
  };
  const endDrag = (e) => {
    if (!drag || (e?.pointerId != null && e.pointerId !== drag.pointerId)) return;
    if (drag.moved) {
      resume();
      if (viewport.hasPointerCapture(drag.pointerId))
        viewport.releasePointerCapture(drag.pointerId);
    }
    drag = null;
  };

  const WHEEL_LINE_HEIGHT_PX = 16;
  let wheelResumeTimer = null;
  const handleWheel = (e) => {
    if (e.deltaX !== 0) return;
    e.preventDefault();
    pause();
    // deltaMode가 px가 아니면(줄/페이지 단위) 변환 안 할 시 Firefox 등에서 스크롤량이 너무 작아짐
    let deltaPx = e.deltaY;
    if (e.deltaMode === 1) deltaPx *= WHEEL_LINE_HEIGHT_PX;
    else if (e.deltaMode === 2) deltaPx *= viewport.clientWidth;
    viewport.scrollLeft += deltaPx;
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
