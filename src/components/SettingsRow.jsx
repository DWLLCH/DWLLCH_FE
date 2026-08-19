import arrowBottom from '../assets/arrow_bottom.svg';
import '../styles/SettingsRow.css';

function SettingsRow({ label, value, chevron = false, danger = false, onClick }) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag type={onClick ? 'button' : undefined} className="settings-row" onClick={onClick}>
      <span className={`settings-row-label${danger ? ' settings-row-label--danger' : ''}`}>
        {label}
      </span>
      <span className="settings-row-right">
        {value && <span className="settings-row-value">{value}</span>}
        {chevron && <img src={arrowBottom} alt="" className="settings-row-chevron" />}
      </span>
    </Tag>
  );
}

export default SettingsRow;
