import PostBadge from './PostBadge';
import '../styles/CommunityPostCard.css';

function CommunityPostCard({ badge, title, description, author, time, thumbnail, onClick }) {
  return (
    <li className="community-post-card">
      <button type="button" className="community-post-card-body" onClick={onClick}>
        <div className="community-post-card-main">
          <div className="community-post-card-heading">
            {badge && <PostBadge type={badge} />}
            <p className="community-post-card-title">{title}</p>
          </div>
          <p className="community-post-card-desc">{description}</p>
          <div className="community-post-card-meta">
            <span>{author}</span>
            <span>{time}</span>
          </div>
        </div>
        {thumbnail && <img src={thumbnail} alt="" className="community-post-card-thumb" />}
      </button>
    </li>
  );
}

export default CommunityPostCard;
