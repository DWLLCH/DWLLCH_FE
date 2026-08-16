import '../styles/MyCommentCard.css';

function MyCommentCard({ commentText, postTitle, time, onClick }) {
  return (
    <li className="my-comment-card">
      <button type="button" className="my-comment-card-body" onClick={onClick}>
        <p className="my-comment-card-text">{commentText}</p>
        <p className="my-comment-card-post">원글 · {postTitle}</p>
        <span className="my-comment-card-time">{time}</span>
      </button>
    </li>
  );
}

export default MyCommentCard;
