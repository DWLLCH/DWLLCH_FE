import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import Button from '../components/Button';
import CommunityPostCard from '../components/CommunityPostCard';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMyPosts } from '../api/community';
import { formatRelativeTime } from '../utils/formatters';
import '../styles/MyActivity.css';

function MyPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const requestIdRef = useRef(0);

  const fetchMyPosts = useCallback((targetPage) => {
    const requestId = ++requestIdRef.current;
    if (targetPage === 0) {
      setLoading(true);
      setError(false);
      setLoadMoreError(false);
    } else {
      setLoadingMore(true);
      setLoadMoreError(false);
    }
    getMyPosts(targetPage)
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setPosts((prev) => (targetPage === 0 ? data.content : [...prev, ...data.content]));
        setHasNext(data.hasNext);
        setPage(targetPage);
      })
      .catch((error) => {
        if (requestId !== requestIdRef.current) return;
        // 리프레시 토큰이 없거나 재발급 후에도 401이면 apiClient 인터셉터가 처리 못 하고
        // 여기까지 넘어오는데, 이 경우는 재시도해도 다시 실패하니 로그인 화면으로 보냄
        if (error.response?.status === 401) {
          window.location.href = '/login';
          return;
        }
        if (targetPage === 0) setError(true);
        else setLoadMoreError(true);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
        setLoadingMore(false);
      });
  }, []);

  useEffect(() => {
    fetchMyPosts(0);
  }, [fetchMyPosts]);

  return (
    <div className="my-activity-page">
      <header className="my-activity-header">
        <button
          type="button"
          className="my-activity-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>내가 쓴 글</h1>
      </header>

      <div className="my-activity-body">
        {loading ? (
          <div className="my-activity-loading">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorState message="글 목록을 불러오지 못했어요" onRetry={() => fetchMyPosts(0)} />
        ) : posts.length === 0 ? (
          <div className="my-activity-empty">
            <p>아직 작성한 글이 없어요</p>
          </div>
        ) : (
          <>
            <ul className="my-activity-list">
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
            {loadMoreError ? (
              <div className="my-activity-loadmore-error">
                <p>글을 더 불러오지 못했어요</p>
                <Button
                  fullWidth
                  className="my-activity-more-btn"
                  onClick={() => fetchMyPosts(page + 1)}
                >
                  다시 시도
                </Button>
              </div>
            ) : (
              hasNext && (
                <Button
                  fullWidth
                  className="my-activity-more-btn"
                  onClick={() => fetchMyPosts(page + 1)}
                  disabled={loadingMore}
                >
                  {loadingMore ? <LoadingSpinner size={16} /> : '더 보기'}
                </Button>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyPosts;
