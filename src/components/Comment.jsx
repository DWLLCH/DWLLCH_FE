import { useState } from 'react';
import arrowBottom from '../assets/arrow_bottom.svg';
import CommentInputBar from './CommentInputBar';
import { formatDateTimeShort } from '../utils/formatters';
import '../styles/Comment.css';

function CommentLikeButton({ likeCount }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount);

  const toggleLike = () => {
    setLiked((prevLiked) => {
      const nextLiked = !prevLiked;
      setCount((prevCount) => prevCount + (nextLiked ? 1 : -1));
      return nextLiked;
    });
  };

  return (
    <button
      type="button"
      className={`comment-like-btn${liked ? ' comment-like-btn--active' : ''}`}
      onClick={toggleLike}
      aria-label={`좋아요 ${count}개`}
      aria-pressed={liked}
    >
      <span className="comment-like-icon" />
      {count}
    </button>
  );
}

function Reply({ reply, commentId, onDeleteReply }) {
  return (
    <div className="comment-reply">
      <p className="comment-reply-author">{reply.author}</p>
      <p className="comment-reply-text">{reply.text}</p>
      <div className="comment-reply-footer">
        <CommentLikeButton likeCount={reply.likeCount} />
        <span className="comment-reply-time">{formatDateTimeShort(reply.createdAt)}</span>
        {reply.isMine && (
          <button
            type="button"
            className="comment-delete-btn"
            onClick={() => onDeleteReply(commentId, reply.id)}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}

function Comment({ comment, onAddReply, onDeleteComment, onDeleteReply }) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAnonymous, setReplyAnonymous] = useState(true);

  const replies = comment.replies || [];

  const handleSubmitReply = () => {
    onAddReply(comment.id, replyText, replyAnonymous);
    setReplyText('');
    setExpanded(true);
  };

  return (
    <li className="comment">
      <div className="comment-header">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-time">{formatDateTimeShort(comment.createdAt)}</span>
      </div>
      <p className={`comment-text${comment.deleted ? ' comment-text--deleted' : ''}`}>
        {comment.deleted ? '삭제된 댓글입니다.' : comment.text}
      </p>
      <div className="comment-footer">
        {!comment.deleted && <CommentLikeButton likeCount={comment.likeCount} />}
        <button
          type="button"
          className="comment-reply-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label={expanded ? `답글 ${replies.length}개 접기` : `답글 ${replies.length}개 보기`}
        >
          <span className="comment-reply-icon" />
          {replies.length}
          <img
            src={arrowBottom}
            alt=""
            className={`comment-reply-arrow${expanded ? ' comment-reply-arrow--open' : ''}`}
          />
        </button>
        {comment.isMine && !comment.deleted && (
          <button
            type="button"
            className="comment-delete-btn"
            onClick={() => onDeleteComment(comment.id)}
          >
            삭제
          </button>
        )}
      </div>

      {expanded && (
        <div className="comment-reply-section">
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              reply={reply}
              commentId={comment.id}
              onDeleteReply={onDeleteReply}
            />
          ))}
          {!comment.deleted && (
            <CommentInputBar
              compact
              value={replyText}
              onChange={setReplyText}
              onSubmit={handleSubmitReply}
              anonymous={replyAnonymous}
              onToggleAnonymous={() => setReplyAnonymous((prev) => !prev)}
              placeholder="답글을 남겨주세요."
            />
          )}
        </div>
      )}
    </li>
  );
}

export default Comment;
