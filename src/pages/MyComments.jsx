import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import Button from '../components/Button';
import MyCommentCard from '../components/MyCommentCard';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMyComments } from '../api/community';
import { formatRelativeTime } from '../utils/formatters';
import '../styles/MyActivity.css';

function MyComments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const requestIdRef = useRef(0);

  const fetchMyComments = useCallback((targetPage) => {
    const requestId = ++requestIdRef.current;
    if (targetPage === 0) {
      setLoading(true);
      setError(false);
      setLoadMoreError(false);
    } else {
      setLoadingMore(true);
      setLoadMoreError(false);
    }
    getMyComments(targetPage)
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setComments((prev) => (targetPage === 0 ? data.content : [...prev, ...data.content]));
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
  }, []);

  useEffect(() => {
    fetchMyComments(0);
  }, [fetchMyComments]);

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
        <h1>내가 쓴 댓글</h1>
      </header>

      <div className="my-activity-body">
        {loading ? (
          <div className="my-activity-loading">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorState message="댓글 목록을 불러오지 못했어요" onRetry={() => fetchMyComments(0)} />
        ) : comments.length === 0 ? (
          <div className="my-activity-empty">
            <p>아직 작성한 댓글이 없어요</p>
          </div>
        ) : (
          <>
            <ul className="my-activity-list">
              {comments.map((comment) => (
                <MyCommentCard
                  key={comment.id}
                  commentText={comment.content}
                  // 백엔드 응답에 postTitle이 아직 없어서 원글 제목은 못 보여줌 (MyCommentCard가 대신 처리)
                  postTitle={comment.postTitle}
                  time={formatRelativeTime(comment.createdAt)}
                  onClick={() =>
                    navigate(`/community/${comment.post}`, {
                      state: { commentId: comment.id },
                    })
                  }
                />
              ))}
            </ul>
            {loadMoreError ? (
              <div className="my-activity-loadmore-error">
                <p>댓글을 더 불러오지 못했어요</p>
                <Button
                  fullWidth
                  className="my-activity-more-btn"
                  onClick={() => fetchMyComments(page + 1)}
                >
                  다시 시도
                </Button>
              </div>
            ) : (
              hasNext && (
                <Button
                  fullWidth
                  className="my-activity-more-btn"
                  onClick={() => fetchMyComments(page + 1)}
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

export default MyComments;
