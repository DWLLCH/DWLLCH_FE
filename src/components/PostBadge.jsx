import '../styles/PostBadge.css';

const BADGE_CONFIG = {
  notice: { label: '공지', className: 'post-badge--notice' },
  hot: { label: 'HOT', className: 'post-badge--hot' },
};

function PostBadge({ type }) {
  const config = BADGE_CONFIG[type];
  if (!config) return null;

  return <span className={`post-badge ${config.className}`}>{config.label}</span>;
}

export default PostBadge;
