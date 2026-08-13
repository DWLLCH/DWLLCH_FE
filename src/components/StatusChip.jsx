import '../styles/StatusChip.css';

const STATUS_CONFIG = {
  met: { label: '충족', bg: '#ecf8f1', border: '#6cd59b', color: '#6cd59b' },
  needCheck: { label: '확인필요', bg: '#fff5d6', border: '#ffc107', color: '#ffc107' },
  done: { label: '준비 완료', bg: '#ecf8f1', border: '#6cd59b', color: '#6cd59b' },
  todo: { label: '미완료', bg: '#ffecec', border: '#ff8a8a', color: '#ff6b6b' },
};

function StatusChip({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`status-chip${size === 'sm' ? ' status-chip--sm' : ''}`}
      style={{ backgroundColor: config.bg, borderColor: config.border, color: config.color }}
    >
      {config.label}
    </span>
  );
}

export default StatusChip;
