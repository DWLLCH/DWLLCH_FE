import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import MyCommentCard from '../components/MyCommentCard';
import { MY_COMMENTS } from '../constants/myActivity';
import '../styles/MyActivity.css';

function MyComments() {
  const navigate = useNavigate();

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
        {MY_COMMENTS.length > 0 ? (
          <ul className="my-activity-list">
            {MY_COMMENTS.map((comment) => (
              <MyCommentCard
                key={comment.id}
                commentText={comment.commentText}
                postTitle={comment.postTitle}
                time={comment.time}
                onClick={() =>
                  navigate(`/community/${comment.postId}`, {
                    state: { commentId: comment.commentId },
                  })
                }
              />
            ))}
          </ul>
        ) : (
          <div className="my-activity-empty">
            <p>아직 작성한 댓글이 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyComments;
