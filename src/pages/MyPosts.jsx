import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import CommunityPostCard from '../components/CommunityPostCard';
import { MY_POSTS } from '../constants/myActivity';
import '../styles/MyActivity.css';

function MyPosts() {
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
        <h1>내가 쓴 글</h1>
      </header>

      <div className="my-activity-body">
        {MY_POSTS.length > 0 ? (
          <ul className="my-activity-list">
            {MY_POSTS.map((post) => (
              <CommunityPostCard
                key={post.id}
                badge={post.badge}
                title={post.title}
                description={post.description}
                author={post.author}
                time={post.time}
                likeCount={post.likeCount}
                commentCount={post.comments.length}
                images={post.images}
                onClick={() => navigate(`/community/${post.id}`)}
              />
            ))}
          </ul>
        ) : (
          <div className="my-activity-empty">
            <p>아직 작성한 글이 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPosts;
