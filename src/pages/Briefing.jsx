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
import { BRIEFING_SECTION_META, getCardVisual } from '../constants/briefing';
import '../styles/Briefing.css';

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
                <div className="briefing-card-row">
                  {section.cards.map((briefing, index) => {
                    const visual = getCardVisual(section.id, index);
                    return (
                      <BriefingCard
                        key={briefing.id}
                        color={visual.color}
                        icon={visual.icon}
                        title={briefing.title}
                        onClick={() => navigate(`/ai-briefing/${briefing.id}`)}
                      />
                    );
                  })}
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
