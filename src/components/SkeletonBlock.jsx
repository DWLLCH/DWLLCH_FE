import '../styles/SkeletonBlock.css';

function SkeletonBlock({ width = '100%', height = 16, radius = 8, className = '' }) {
  return (
    <span
      className={`skeleton-block${className ? ` ${className}` : ''}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export default SkeletonBlock;
