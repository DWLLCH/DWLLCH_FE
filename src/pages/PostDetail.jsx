import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import like from '../assets/like.svg';
import share from '../assets/share.svg';
import commentIcon from '../assets/comment.svg';
import PostActionButton from '../components/PostActionButton';
import PostBadge from '../components/PostBadge';
import CommentInputBar from '../components/CommentInputBar';
import Comment from '../components/Comment';
import { NOTICE_POST, POSTS } from '../constants/community';
import { CURRENT_USER_NAME } from '../constants/home';
import { formatDateTimeShort } from '../utils/formatters';
import '../styles/PostDetail.css';

function getNextAnonymousNumber(comments) {
  let max = 0;
  comments.forEach((comment) => {
    const match = /^익명 (\d+)$/.exec(comment.author);
    if (match) max = Math.max(max, Number(match[1]));
    (comment.replies || []).forEach((reply) => {
      const replyMatch = /^익명 (\d+)$/.exec(reply.author);
      if (replyMatch) max = Math.max(max, Number(replyMatch[1]));
    });
  });
  return max + 1;
}

function getAnonymousStorageKey(postId) {
  return `community-anonymous-number-${postId}`;
}

function readStoredAnonymousNumber(postId) {
  const stored = sessionStorage.getItem(getAnonymousStorageKey(postId));
  return stored ? Number(stored) : null;
}

function writeStoredAnonymousNumber(postId, number) {
  sessionStorage.setItem(getAnonymousStorageKey(postId), String(number));
}

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const post = [NOTICE_POST, ...POSTS].find((item) => String(item.id) === id);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);
  const [comments, setComments] = useState(post?.comments || []);
  const [commentText, setCommentText] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [myAnonymousNumber, setMyAnonymousNumber] = useState(() =>
    post ? readStoredAnonymousNumber(post.id) : null,
  );

  useEffect(() => {
    if (!post) return;
    setLiked(false);
    setLikeCount(post.likeCount);
    setComments(post.comments || []);
    setCommentText('');
    setAnonymous(true);
    setMyAnonymousNumber(readStoredAnonymousNumber(post.id));
  }, [id]);

  const getMyAnonymousLabel = (currentComments) => {
    if (myAnonymousNumber !== null) return `익명 ${myAnonymousNumber}`;
    const next = getNextAnonymousNumber(currentComments);
    setMyAnonymousNumber(next);
    writeStoredAnonymousNumber(post.id, next);
    return `익명 ${next}`;
  };

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? -1 : 1));
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
    }
  };

  const handleAddComment = () => {
    const author = anonymous ? getMyAnonymousLabel(comments) : CURRENT_USER_NAME;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author,
        createdAt: new Date(),
        text: commentText,
        likeCount: 0,
        replies: [],
        isMine: true,
      },
    ]);
    setCommentText('');
  };

  const handleAddReply = (commentId, text, replyAnonymous) => {
    const author = replyAnonymous ? getMyAnonymousLabel(comments) : CURRENT_USER_NAME;
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies || []),
                { id: Date.now(), author, createdAt: new Date(), text, likeCount: 0, isMine: true },
              ],
            }
          : comment,
      ),
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) =>
      prev.reduce((result, comment) => {
        if (comment.id !== commentId) {
          result.push(comment);
        } else if ((comment.replies || []).length > 0) {
          result.push({ ...comment, deleted: true });
        }
        return result;
      }, []),
    );
  };

  const handleDeleteReply = (commentId, replyId) => {
    setComments((prev) =>
      prev.reduce((result, comment) => {
        if (comment.id !== commentId) {
          result.push(comment);
          return result;
        }
        const remainingReplies = comment.replies.filter((reply) => reply.id !== replyId);
        if (comment.deleted && remainingReplies.length === 0) {
          return result;
        }
        result.push({ ...comment, replies: remainingReplies });
        return result;
      }, []),
    );
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
              <img key={image + index} src={image} alt="" className="post-detail-image" />
            ))}
          </div>
        )}

        <div className="post-detail-content">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="post-detail-actions">
          <PostActionButton
            icon={like}
            label="좋아요"
            count={likeCount}
            active={liked}
            onClick={toggleLike}
          />
          <PostActionButton icon={share} label="공유하기" onClick={handleShare} />
        </div>

        <div className="post-detail-divider" />

        <div className="post-detail-comment-header">
          <span>댓글 {comments.length}</span>
        </div>

        {comments.length === 0 ? (
          <div className="post-detail-comment-empty">
            <img src={commentIcon} alt="" />
            <p>첫 댓글을 남겨주세요.</p>
          </div>
        ) : (
          <ul className="post-detail-comment-list">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onAddReply={handleAddReply}
                onDeleteComment={handleDeleteComment}
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
    </div>
  );
}

export default PostDetail;
