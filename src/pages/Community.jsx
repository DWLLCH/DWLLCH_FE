import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import BottomNav from '../components/BottomNav';
import CategoryChip from '../components/CategoryChip';
import CommunityPostCard from '../components/CommunityPostCard';
import WriteFabButton from '../components/WriteFabButton';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonBlock from '../components/SkeletonBlock';
import { CATEGORIES, LABEL_TO_BOARD_TYPE } from '../constants/community';
import { getPosts } from '../api/community';
import { formatRelativeTime } from '../utils/formatters';
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
  const [activeCategory, setActiveCategory] = useState('최신');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const boardType = LABEL_TO_BOARD_TYPE[activeCategory];
  const requestIdRef = useRef(0);

  const fetchPosts = useCallback(
    (targetPage) => {
      const requestId = ++requestIdRef.current;
      if (targetPage === 0) setLoading(true);
      else setLoadingMore(true);
      setError(false);
      getPosts(boardType, targetPage)
        .then((data) => {
          if (requestId !== requestIdRef.current) return;
          setPosts((prev) => (targetPage === 0 ? data.content : [...prev, ...data.content]));
          setHasNext(data.hasNext);
          setPage(targetPage);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setError(true);
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
  }, [boardType]);

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
        ) : posts.length === 0 ? (
          <p className="community-empty">아직 등록된 게시글이 없어요</p>
        ) : (
          <>
            <ul className="community-post-list">
              {posts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  badge={post.isPinned ? 'notice' : undefined}
                  title={post.title}
                  description={post.excerpt}
                  author={post.authorName}
                  time={formatRelativeTime(post.createdAt)}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                  images={post.thumbnail ? [post.thumbnail] : undefined}
                  onClick={() => navigate(`/community/${post.id}`)}
                />
              ))}
            </ul>
            {hasNext && (
              <button
                type="button"
                className="community-more-btn"
                onClick={() => fetchPosts(page + 1)}
                disabled={loadingMore}
              >
                {loadingMore ? <LoadingSpinner size={16} /> : '더 보기'}
              </button>
            )}
          </>
        )}
      </div>

      <WriteFabButton onClick={() => navigate('/community/write')} />
      <BottomNav />
    </div>
  );
}

export default Community;
