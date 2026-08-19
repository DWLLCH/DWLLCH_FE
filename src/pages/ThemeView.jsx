import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import ThemeGroup from '../components/ThemeGroup';
import ChatbotButton from '../components/ChatbotButton';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { getHomeCuration } from '../api/home';
import { getMyProfile } from '../api/mypage';
import '../styles/ThemeView.css';

// Policy.category → ThemeCard 아이콘(THEME_ICONS 키) 매핑, 대응 안 되는 카테고리는 file로 대체
const CATEGORY_ICONS = {
  HOUSING: 'file',
  EMPLOYMENT: 'chat',
  FINANCE: 'money',
  EDUCATION: 'file',
  MENTAL_HEALTH: 'chat',
  ETC: 'file',
};

function toCard(policy, description) {
  return {
    id: policy.id,
    icon: CATEGORY_ICONS[policy.category] || 'file',
    title: policy.organization ? `${policy.title} / ${policy.organization}` : policy.title,
    description: description || policy.summary,
  };
}

function ThemeView() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [curation, setCuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCuration = useCallback(() => {
    setLoading(true);
    setError(false);
    getHomeCuration()
      .then((data) => setCuration(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCuration();
  }, [fetchCuration]);

  // 인사말 개인화용, 실패해도 화면 전체를 막을 정도는 아니라서 조용히 무시함
  useEffect(() => {
    getMyProfile()
      .then((profile) => setUsername(profile.username || ''))
      .catch(() => {});
  }, []);

  const handleCardClick = (id) => navigate(`/support/${id}`);

  const regionCards = (curation?.regionMatched || []).map((policy) => toCard(policy));
  const conditionCards = (curation?.conditionMatched || []).map(({ policy, matchReason }) =>
    toCard(policy, matchReason),
  );

  return (
    <div className="theme-page">
      <header className="theme-header">
        <button
          type="button"
          className="theme-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>테마별 보기</h1>
      </header>

      <div className="theme-body">
        {loading && (
          <div className="theme-loading">
            <LoadingSpinner />
          </div>
        )}

        {!loading && error && (
          <ErrorState message="맞춤 정책을 불러오지 못했어요" onRetry={fetchCuration} />
        )}

        {!loading && !error && curation && (
          <>
            {regionCards.length > 0 ? (
              <ThemeGroup
                title={
                  username ? `${username}님의 주거지역에 딱맞는 제도` : '내 주거지역에 딱맞는 제도'
                }
                color="blue"
                cards={regionCards}
                onCardClick={handleCardClick}
              />
            ) : (
              <p className="theme-empty">지역에 맞는 제도를 찾지 못했어요</p>
            )}

            {curation.profileIncomplete ? (
              <div className="theme-incomplete">
                <p>자립 정보를 더 입력하면 조건에 꼭 맞는 제도를 추천해드려요</p>
                <Button variant="blue" fullWidth onClick={() => navigate('/my-info')}>
                  내 정보 입력하러 가기
                </Button>
              </div>
            ) : conditionCards.length > 0 ? (
              <ThemeGroup
                title={username ? `${username}님의 조건에 딱맞는 제도` : '내 조건에 딱맞는 제도'}
                color="green"
                cards={conditionCards}
                onCardClick={handleCardClick}
              />
            ) : (
              <div className="theme-incomplete">
                <p>아직 조건에 맞는 제도를 찾지 못했어요</p>
                <Button variant="gray" fullWidth onClick={() => navigate('/support/list')}>
                  전체 정책 둘러보기
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <ChatbotButton onClick={() => navigate('/chatbot')} />
    </div>
  );
}

export default ThemeView;
