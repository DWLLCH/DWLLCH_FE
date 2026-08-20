import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import CategoryChip from '../components/CategoryChip';
import CommunityPostCard from '../components/CommunityPostCard';
import WriteFabButton from '../components/WriteFabButton';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonBlock from '../components/SkeletonBlock';
import LoginRequiredModal from '../components/LoginRequiredModal';
import useBlock from '../hooks/useBlock';
import { CATEGORIES, LABEL_TO_BOARD_TYPE } from '../constants/community';
import { getPosts } from '../api/community';
import { getAccessToken } from '../api/auth';
import { formatRelativeTime, toSecureImageUrl } from '../utils/formatters';
import '../styles/Community.css';

function CommunitySkeletonList() {
  return (
    <ul className="community-post-list" aria-hidden="true">
      {[0, 1, 2].map((key) => (
        <li key={key} className="community-post-card community-post-card--skeleton">
          <div className="community-post-card-body">
            <div className="community-post-card-main">
              <SkeletonBlock width="70%" height={15} />
              <SkeletonBlock width="45%" height={13} className="community-skeleton-desc" />
              <SkeletonBlock width="30%" height={11} className="community-skeleton-meta" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Community() {
  const navigate = useNavigate();
  // 매 렌더마다 새로 확인함 (로그인/로그아웃으로 토큰이 바뀌어도 즉시 반영되도록)
  const isLoggedIn = Boolean(getAccessToken());
  const [activeCategory, setActiveCategory] = useState('최신');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const boardType = LABEL_TO_BOARD_TYPE[activeCategory];
  const requestIdRef = useRef(0);
  const { isAuthorBlocked } = useBlock();

  const fetchPosts = useCallback(
    (targetPage) => {
      const requestId = ++requestIdRef.current;
      if (targetPage === 0) {
        setLoading(true);
        setError(false);
        setLoadMoreError(false);
      } else {
        setLoadingMore(true);
        setLoadMoreError(false);
      }
      getPosts(boardType, targetPage)
        .then((data) => {
          if (requestId !== requestIdRef.current) return;
          setPosts((prev) => (targetPage === 0 ? data.content : [...prev, ...data.content]));
          setHasNext(data.hasNext);
          setPage(targetPage);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          if (targetPage === 0) setError(true);
          else setLoadMoreError(true);
        })
        .finally(() => {
          if (requestId !== requestIdRef.current) return;
          setLoading(false);
          setLoadingMore(false);
        });
    },
    [boardType],
  );

  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  // 차단은 authorId(targetUserId) 기준으로 저장됨(PostDetail.jsx 참고)
  // BE가 목록 응답(PostListSerializer)에 authorId를 내려주기 시작해서 필터링이 실제로 동작함(#158)
  const visiblePosts = posts.filter((post) => !isAuthorBlocked(post.authorId));

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    navigate('/community/write');
  };

  return (
    <div className="community-page">
      <header className="community-header">
        <button
          type="button"
          className="community-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>커뮤니티</h1>
      </header>

      <div className="community-tabs">
        {CATEGORIES.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            selected={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </div>

      <div className="community-body">
        {loading ? (
          <CommunitySkeletonList />
        ) : error ? (
          <ErrorState message="게시글을 불러오지 못했어요" onRetry={() => fetchPosts(0)} />
        ) : visiblePosts.length === 0 ? (
          <p className="community-empty">아직 등록된 게시글이 없어요</p>
        ) : (
          <>
            <ul className="community-post-list">
              {visiblePosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  badge={post.isPinned ? 'notice' : undefined}
                  title={post.title}
                  description={post.excerpt}
                  author={post.authorName}
                  time={formatRelativeTime(post.createdAt)}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                  images={post.thumbnail ? [toSecureImageUrl(post.thumbnail)] : undefined}
                  onClick={() => navigate(`/community/${post.id}`)}
                />
              ))}
            </ul>
            {loadMoreError ? (
              <div className="community-loadmore-error">
                <p>게시글을 더 불러오지 못했어요</p>
                <Button
                  fullWidth
                  className="community-more-btn"
                  onClick={() => fetchPosts(page + 1)}
                >
                  다시 시도
                </Button>
              </div>
            ) : (
              hasNext && (
                <Button
                  fullWidth
                  className="community-more-btn"
                  onClick={() => fetchPosts(page + 1)}
                  disabled={loadingMore}
                >
                  {loadingMore ? <LoadingSpinner size={16} /> : '더 보기'}
                </Button>
              )
            )}
          </>
        )}
      </div>

      <WriteFabButton onClick={handleWriteClick} />
      <BottomNav />

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        description="로그인하고 커뮤니티에 글을 작성해보세요"
      />
    </div>
  );
}

export default Community;
