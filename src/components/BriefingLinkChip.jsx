import '../styles/BriefingLinkChip.css';

function BriefingLinkChip({ label, onClick }) {
  return (
    <button type="button" className="briefing-link-chip" onClick={onClick}>
      <span>{label}</span>
      <span className="briefing-link-chip-arrow" aria-hidden="true" />
    </button>
  );
}

export default BriefingLinkChip;
