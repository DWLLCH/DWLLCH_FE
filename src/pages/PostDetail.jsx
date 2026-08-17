import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import like from '../assets/like.svg';
import share from '../assets/share.svg';
import commentIcon from '../assets/comment.svg';
import PostActionButton from '../components/PostActionButton';
import PostBadge from '../components/PostBadge';
import CommentInputBar from '../components/CommentInputBar';
import Comment from '../components/Comment';
import PollCard from '../components/PollCard';
import LoginRequiredModal from '../components/LoginRequiredModal';
import { NOTICE_POST, POSTS } from '../constants/community';
import { getComments, createComment, updateComment, deleteComment } from '../api/community';
import { getMyProfile } from '../api/mypage';
import { getAccessToken } from '../api/auth';
import { formatDateTimeShort } from '../utils/formatters';
import '../styles/PostDetail.css';

// 댓글 목록(GET)은 post/comment를 parentId 기준으로 평탄화해서 내려주기 때문에
// 프론트에서 최상위 댓글 + 답글(1depth) 트리로 묶어줘야 함
function buildCommentTree(rawComments, { username, myCommentIds }) {
  const isMine = (item) =>
    myCommentIds.has(item.id) || (!item.isAnonymous && !!username && item.authorName === username);

  const repliesByParent = {};
  const topLevel = [];

  rawComments.forEach((item) => {
    if (item.parentId) {
      if (!repliesByParent[item.parentId]) repliesByParent[item.parentId] = [];
      repliesByParent[item.parentId].push(item);
    } else {
      topLevel.push(item);
    }
  });

  return topLevel.map((item) => ({
    id: item.id,
    author: item.authorName,
    text: item.content,
    deleted: item.isDeleted,
    likeCount: item.likeCount,
    isMine: isMine(item),
    createdAt: item.createdAt,
    replies: (repliesByParent[item.id] || []).map((reply) => ({
      id: reply.id,
      author: reply.authorName,
      text: reply.content,
      deleted: reply.isDeleted,
      likeCount: reply.likeCount,
      isMine: isMine(reply),
      createdAt: reply.createdAt,
    })),
  }));
}

function PostDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const post = [NOTICE_POST, ...POSTS].find((item) => String(item.id) === id);
  const targetCommentId = location.state?.commentId;

  // 댓글 API는 실제 게시글(id가 숫자)에만 연동함, 공지 게시글은 목데이터라 대상에서 제외
  const canUseCommentApi = typeof post?.id === 'number';

  const [isLoggedIn] = useState(() => Boolean(getAccessToken()));
  const [likeState, setLikeState] = useState({ liked: false, count: post?.likeCount ?? 0 });

  const [rawComments, setRawComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(canUseCommentApi);
  const [commentsError, setCommentsError] = useState(false);
  // 백엔드 댓글 목록에는 isMine이 없어서, 이번 세션에서 내가 작성한 댓글 id를 직접 추적함
  // (비로그인 시절부터 있던 익명 댓글까지 완벽하게 구분하려면 백엔드에 isMine 추가가 필요함)
  const [myCommentIds, setMyCommentIds] = useState(() => new Set());
  const [username, setUsername] = useState('');

  const [commentText, setCommentText] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [highlightedCommentId, setHighlightedCommentId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchComments = useCallback(() => {
    if (!canUseCommentApi) {
      setRawComments([]);
      setCommentsLoading(false);
      setCommentsError(false);
      return;
    }
    setCommentsLoading(true);
    setCommentsError(false);
    getComments(post.id)
      .then((data) => {
        setRawComments(data || []);
      })
      .catch(() => {
        setCommentsError(true);
      })
      .finally(() => {
        setCommentsLoading(false);
      });
  }, [canUseCommentApi, post?.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (!isLoggedIn) return;
    getMyProfile()
      .then((data) => setUsername(data.username || ''))
      .catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => {
    if (!targetCommentId) return undefined;
    const el = document.getElementById(`comment-${targetCommentId}`);
    if (!el) return undefined;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedCommentId(targetCommentId);
    const timer = setTimeout(() => setHighlightedCommentId(null), 1600);
    return () => clearTimeout(timer);
  }, [targetCommentId]);

  useEffect(() => {
    if (!post) return;
    setLikeState({ liked: false, count: post.likeCount ?? 0 });
    setCommentText('');
    setAnonymous(true);
  }, [post]);

  const toggleLike = () => {
    setLikeState((prev) => ({
      liked: !prev.liked,
      count: prev.count + (prev.liked ? -1 : 1),
    }));
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.description || post.title,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다.');
      } catch {
        alert('링크 복사에 실패했습니다.');
      }
    } else {
      alert('공유하기를 지원하지 않는 환경입니다.');
    }
  };

  const handleAddComment = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (!commentText.trim()) return;
    createComment(post.id, { content: commentText.trim(), isAnonymous: anonymous })
      .then((created) => {
        setRawComments((prev) => [...prev, created]);
        setMyCommentIds((prev) => new Set(prev).add(created.id));
        setCommentText('');
      })
      .catch(() => {
        alert('댓글 등록에 실패했습니다.');
      });
  };

  const handleAddReply = (commentId, text, replyAnonymous) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (!text.trim()) return;
    createComment(post.id, {
      content: text.trim(),
      isAnonymous: replyAnonymous,
      parentId: commentId,
    })
      .then((created) => {
        setRawComments((prev) => [...prev, created]);
        setMyCommentIds((prev) => new Set(prev).add(created.id));
      })
      .catch(() => {
        alert('답글 등록에 실패했습니다.');
      });
  };

  const handleEditComment = (commentId, text) => {
    updateComment(commentId, { content: text })
      .then((updated) => {
        setRawComments((prev) => prev.map((item) => (item.id === commentId ? updated : item)));
      })
      .catch(() => {
        alert('댓글 수정에 실패했습니다.');
      });
  };

  const handleEditReply = (commentId, replyId, text) => {
    updateComment(replyId, { content: text })
      .then((updated) => {
        setRawComments((prev) => prev.map((item) => (item.id === replyId ? updated : item)));
      })
      .catch(() => {
        alert('답글 수정에 실패했습니다.');
      });
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId)
      .then(() => {
        // 삭제 후 GET을 다시 부르면 로딩 화면이 잠깐 떴다 사라지면서 답글 토글이 다 닫히고,
        // 백엔드가 삭제된 댓글의 authorName을 "" 으로 비워서 내려주기 때문에 닉네임도 사라짐
        // 그래서 다시 불러오지 않고, 지금 갖고 있는 값(닉네임/좋아요 수)을 그대로 유지한 채
        // 답글이 있으면 소프트 삭제, 없으면 목록에서 제거하는 걸 로컬에서 흉내냄
        setRawComments((prev) => {
          const hasReplies = prev.some((item) => item.parentId === commentId);
          if (hasReplies) {
            return prev.map((item) =>
              item.id === commentId
                ? { ...item, content: '삭제된 댓글입니다.', isDeleted: true }
                : item,
            );
          }
          return prev.filter((item) => item.id !== commentId);
        });
      })
      .catch(() => {
        alert('댓글 삭제에 실패했습니다.');
      });
  };

  const handleDeleteReply = (commentId, replyId) => {
    // 답글에는 대댓글이 달릴 수 없어서 답글 삭제는 항상 완전 삭제(하드 삭제)됨
    deleteComment(replyId)
      .then(() => {
        setRawComments((prev) => prev.filter((item) => item.id !== replyId));
      })
      .catch(() => {
        alert('답글 삭제에 실패했습니다.');
      });
  };

  if (!post) {
    return (
      <div className="post-detail-page">
        <header className="post-detail-header">
          <button
            type="button"
            className="post-detail-back"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <img src={backBtn} alt="" />
          </button>
          <h1>커뮤니티</h1>
        </header>
        <div className="post-detail-notfound">
          <p>게시글을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const comments = buildCommentTree(rawComments, { username, myCommentIds });

  return (
    <div className="post-detail-page">
      <header className="post-detail-header">
        <button
          type="button"
          className="post-detail-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>커뮤니티</h1>
      </header>

      <div className="post-detail-body">
        {post.badge === 'notice' ? (
          <PostBadge type="notice" />
        ) : (
          <span className="post-detail-category">{post.category}</span>
        )}

        <h2 className="post-detail-title">{post.title}</h2>
        <div className="post-detail-meta">
          <span>{post.author}</span>
          <span>
            {formatDateTimeShort(post.createdAt)} · 조회 {post.viewCount.toLocaleString()}회
          </span>
        </div>

        {post.images && post.images.length > 0 && (
          <div
            className={`post-detail-images${post.images.length > 1 ? ' post-detail-images--multi' : ''}`}
          >
            {post.images.map((image, index) => (
              <img
                key={image + index}
                src={image}
                alt={`${post.title} 이미지 ${index + 1}`}
                className="post-detail-image"
              />
            ))}
          </div>
        )}

        <div className="post-detail-content">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {post.poll && <PollCard key={post.id} poll={post.poll} />}

        <div className="post-detail-actions">
          <PostActionButton
            icon={like}
            label="좋아요"
            count={likeState.count}
            active={likeState.liked}
            onClick={toggleLike}
          />
          <PostActionButton icon={share} label="공유하기" onClick={handleShare} />
        </div>

        <div className="post-detail-divider" />

        <div className="post-detail-comment-header">
          <span>댓글 {comments.length}</span>
        </div>

        {commentsLoading ? (
          <div className="post-detail-comment-empty">
            <p>댓글을 불러오는 중이에요</p>
          </div>
        ) : commentsError ? (
          <div className="post-detail-comment-empty">
            <p>댓글을 불러오지 못했어요</p>
            <button type="button" className="post-detail-comment-retry" onClick={fetchComments}>
              다시 시도
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="post-detail-comment-empty">
            <img src={commentIcon} alt="" />
            <p>첫 댓글을 남겨주세요.</p>
          </div>
        ) : (
          <ul className="post-detail-comment-list">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                id={`comment-${comment.id}`}
                comment={comment}
                highlighted={comment.id === highlightedCommentId}
                onAddReply={handleAddReply}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                onEditReply={handleEditReply}
                onDeleteReply={handleDeleteReply}
              />
            ))}
          </ul>
        )}
      </div>

      <CommentInputBar
        value={commentText}
        onChange={setCommentText}
        onSubmit={handleAddComment}
        anonymous={anonymous}
        onToggleAnonymous={() => setAnonymous((prev) => !prev)}
      />

      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

export default PostDetail;
