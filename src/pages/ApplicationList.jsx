import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import searchIcon from '../assets/search.svg';
import bookmarkFill from '../assets/bookmark_fill.svg';
import light from '../assets/light.svg';
import PolicyCard from '../components/PolicyCard';
import ChatbotButton from '../components/ChatbotButton';
import BottomNav from '../components/BottomNav';
import LoadingSpinner from '../components/LoadingSpinner';
import LoginRequiredModal from '../components/LoginRequiredModal';
import OnboardingRequiredModal from '../components/OnboardingRequiredModal';
import useBookmarks from '../hooks/useBookmarks';
import useOnboardingComplete from '../hooks/useOnboardingComplete';
import { getAccessToken } from '../api/auth';
import { formatDday, toPolicyLevel } from '../utils/formatters';
import '../styles/Bookmark.css';

function ApplicationList() {
  const navigate = useNavigate();
  const { scraps, loading, maxCount } = useBookmarks();
  const [keyword, setKeyword] = useState('');
  const [isLoggedIn] = useState(() => Boolean(getAccessToken()));
  const { status: onboardingStatus } = useOnboardingComplete();
  const onboardingChecking = isLoggedIn && onboardingStatus === 'checking';
  const onboardingBlocked =
    isLoggedIn && (onboardingStatus === 'incomplete' || onboardingStatus === 'error');

  const visibleScraps = useMemo(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return scraps;
    return scraps.filter((scrap) => scrap.policyTitle?.includes(trimmed));
  }, [scraps, keyword]);

  return (
    <div className="bookmark-page">
      <header className="bookmark-header">
        <button
          type="button"
          className="bookmark-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>신청</h1>
      </header>

      <div className="bookmark-body">
        {onboardingChecking ? (
          <div className="bookmark-empty">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="bookmark-search-box">
              <input
                className="bookmark-search-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="정책 검색"
                aria-label="정책 검색"
              />
              <img src={searchIcon} alt="" className="bookmark-search-icon" />
            </div>

            <div className="bookmark-summary">
              <div className="bookmark-summary-row">
                <span className="bookmark-summary-icon">
                  <img src={bookmarkFill} alt="" />
                </span>
                <p>
                  총 <strong>{scraps.length}개</strong>의 정책을 북마크했어요
                </p>
              </div>
            </div>

            {loading ? (
              <div className="bookmark-empty">
                <LoadingSpinner />
              </div>
            ) : visibleScraps.length > 0 ? (
              <ul className="bookmark-list">
                {visibleScraps.map((scrap) => (
                  <PolicyCard
                    key={scrap.policyId}
                    level={toPolicyLevel(scrap.matchLevel)}
                    dday={formatDday(scrap.applicationEnd)}
                    title={scrap.policyTitle}
                    description={scrap.matchReason}
                    onClick={() => navigate(`/support/${scrap.policyId}`)}
                  />
                ))}
              </ul>
            ) : (
              <div className="bookmark-empty">
                <p>{scraps.length === 0 ? '아직 신청한 정책이 없어요' : '검색 결과가 없어요'}</p>
              </div>
            )}
          </>
        )}
      </div>

      <ChatbotButton onClick={() => navigate('/chatbot')} />
      <BottomNav />

      <LoginRequiredModal open={!isLoggedIn} onClose={() => navigate('/home')} />
      <OnboardingRequiredModal open={onboardingBlocked} onClose={() => navigate('/home')} />
    </div>
  );
}

export default ApplicationList;
