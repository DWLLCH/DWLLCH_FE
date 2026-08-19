import { useState } from 'react';
import arrowBottom from '../assets/arrow_bottom.svg';
import arrowUp from '../assets/arrow_up.svg';
import CommentInputBar from './CommentInputBar';
import { formatDateTimeShort } from '../utils/formatters';
import '../styles/Comment.css';

function CommentLikeButton({ liked, count, onToggle }) {
  return (
    <button
      type="button"
      className={`comment-like-btn${liked ? ' comment-like-btn--active' : ''}`}
      onClick={onToggle}
      aria-label={`좋아요 ${count}개`}
      aria-pressed={liked}
    >
      <span className="comment-like-icon" />
      {count}
    </button>
  );
}

function CommentEditBox({ initialText, onSave, onCancel }) {
  const [editText, setEditText] = useState(initialText);

  const handleSave = () => {
    if (!editText.trim()) return;
    onSave(editText.trim());
  };

  return (
    <div className="comment-edit-box">
      <input
        type="text"
        className="comment-edit-input"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        aria-label="댓글 수정"
      />
      <div className="comment-edit-actions">
        <button type="button" className="comment-edit-save" onClick={handleSave}>
          저장
        </button>
        <button type="button" className="comment-edit-cancel" onClick={onCancel}>
          취소
        </button>
      </div>
    </div>
  );
}

function Reply({ reply, commentId, onEditReply, onDeleteReply, onToggleLike }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveEdit = (text) => {
    onEditReply(commentId, reply.id, text);
    setIsEditing(false);
  };

  return (
    <div className="comment-reply">
      <p className={`comment-reply-author${reply.isAuthor ? ' comment-reply-author--owner' : ''}`}>
        {reply.author}
        {reply.isAuthor && '(글쓴이)'}
      </p>
      {isEditing ? (
        <CommentEditBox
          initialText={reply.text}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="comment-reply-text">{reply.text}</p>
      )}
      <div className="comment-reply-footer">
        <CommentLikeButton
          liked={reply.isLiked}
          count={reply.likeCount}
          onToggle={() => onToggleLike(reply.id)}
        />
        <span className="comment-reply-time">{formatDateTimeShort(reply.createdAt)}</span>
        {reply.isMine && !isEditing && (
          <>
            <button type="button" className="comment-edit-btn" onClick={() => setIsEditing(true)}>
              수정
            </button>
            <button
              type="button"
              className="comment-delete-btn"
              onClick={() => onDeleteReply(commentId, reply.id)}
            >
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Comment({
  id,
  comment,
  highlighted,
  lockRealName = false,
  onAddReply,
  onEditComment,
  onDeleteComment,
  onEditReply,
  onDeleteReply,
  onToggleLike,
}) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAnonymous, setReplyAnonymous] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const replies = comment.replies || [];
  const effectiveReplyAnonymous = lockRealName ? false : replyAnonymous;

  const handleSubmitReply = () => {
    onAddReply(comment.id, replyText, effectiveReplyAnonymous);
    setReplyText('');
    setExpanded(true);
  };

  const handleSaveEdit = (text) => {
    onEditComment(comment.id, text);
    setIsEditing(false);
  };

  return (
    <li id={id} className={`comment${highlighted ? ' comment--highlighted' : ''}`}>
      <div className="comment-header">
        <span className={`comment-author${comment.isAuthor ? ' comment-author--owner' : ''}`}>
          {comment.author}
          {comment.isAuthor && '(글쓴이)'}
        </span>
        <span className="comment-time">{formatDateTimeShort(comment.createdAt)}</span>
      </div>
      {isEditing ? (
        <CommentEditBox
          initialText={comment.text}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className={`comment-text${comment.deleted ? ' comment-text--deleted' : ''}`}>
          {comment.deleted ? '삭제된 댓글입니다.' : comment.text}
        </p>
      )}
      <div className="comment-footer">
        <CommentLikeButton
          liked={comment.isLiked}
          count={comment.likeCount}
          onToggle={() => onToggleLike(comment.id)}
        />
        <button
          type="button"
          className="comment-reply-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label={expanded ? `답글 ${replies.length}개 접기` : `답글 ${replies.length}개 보기`}
        >
          <span className="comment-reply-icon" />
          {replies.length}
          <img src={expanded ? arrowUp : arrowBottom} alt="" className="comment-reply-arrow" />
        </button>
        {comment.isMine && !comment.deleted && !isEditing && (
          <>
            <button type="button" className="comment-edit-btn" onClick={() => setIsEditing(true)}>
              수정
            </button>
            <button
              type="button"
              className="comment-delete-btn"
              onClick={() => onDeleteComment(comment.id)}
            >
              삭제
            </button>
          </>
        )}
      </div>

      {expanded && (
        <div className="comment-reply-section">
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              reply={reply}
              commentId={comment.id}
              onEditReply={onEditReply}
              onDeleteReply={onDeleteReply}
              onToggleLike={onToggleLike}
            />
          ))}
          {!comment.deleted && (
            <CommentInputBar
              compact
              value={replyText}
              onChange={setReplyText}
              onSubmit={handleSubmitReply}
              anonymous={effectiveReplyAnonymous}
              onToggleAnonymous={
                lockRealName ? undefined : () => setReplyAnonymous((prev) => !prev)
              }
              hideAnonymous={lockRealName}
              placeholder="답글을 남겨주세요."
            />
          )}
        </div>
      )}
    </li>
  );
}

export default Comment;
