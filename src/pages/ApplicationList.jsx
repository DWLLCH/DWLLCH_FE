import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import searchIcon from '../assets/search.svg';
import check from '../assets/check.svg';
import PolicyCard from '../components/PolicyCard';
import ChatbotButton from '../components/ChatbotButton';
import BottomNav from '../components/BottomNav';
import LoadingSpinner from '../components/LoadingSpinner';
import LoginRequiredModal from '../components/LoginRequiredModal';
import OnboardingRequiredModal from '../components/OnboardingRequiredModal';
import useApplication from '../hooks/useApplication';
import useOnboardingComplete from '../hooks/useOnboardingComplete';
import { getAccessToken } from '../api/auth';
import { formatDateKorean, formatDday, parseDateKey, toPolicyLevel } from '../utils/formatters';
import '../styles/Bookmark.css';

// BE Application.Status 라벨 (mypage/models.py 기준)
const STATUS_LABELS = {
  PLANNED: '신청 예정',
  IN_PROGRESS: '신청 중',
  COMPLETED: '신청 완료',
  REJECTED: '반려',
};

function buildDescription(application) {
  const parsedDate = parseDateKey(application.dateKey);
  const dateText = parsedDate ? formatDateKorean(parsedDate) : null;
  const statusLabel = STATUS_LABELS[application.status] || application.status;

  if (dateText) return `${dateText}에 ${statusLabel}`;
  return statusLabel;
}

function ApplicationList() {
  const navigate = useNavigate();
  const { applicationList, loading } = useApplication();
  const [keyword, setKeyword] = useState('');
  const [isLoggedIn] = useState(() => Boolean(getAccessToken()));
  const { status: onboardingStatus } = useOnboardingComplete();
  const onboardingChecking = isLoggedIn && onboardingStatus === 'checking';
  const onboardingBlocked =
    isLoggedIn && (onboardingStatus === 'incomplete' || onboardingStatus === 'error');

  const visibleApplications = useMemo(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return applicationList;
    return applicationList.filter((application) => application.policyTitle?.includes(trimmed));
  }, [applicationList, keyword]);

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
                  <img src={check} alt="" />
                </span>
                <p>
                  총 <strong>{applicationList.length}개</strong>의 정책에 신청했어요
                </p>
              </div>
            </div>

            {loading ? (
              <div className="bookmark-empty">
                <LoadingSpinner />
              </div>
            ) : visibleApplications.length > 0 ? (
              <ul className="bookmark-list">
                {visibleApplications.map((application) => (
                  <PolicyCard
                    key={application.id}
                    level={toPolicyLevel(application.matchLevel)}
                    dday={formatDday(application.applicationEnd)}
                    title={application.policyTitle}
                    description={buildDescription(application)}
                    onClick={() => navigate(`/support/${application.policyId}`)}
                  />
                ))}
              </ul>
            ) : (
              <div className="bookmark-empty">
                <p>
                  {applicationList.length === 0
                    ? '아직 신청한 정책이 없어요'
                    : '검색 결과가 없어요'}
                </p>
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
