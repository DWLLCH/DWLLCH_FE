import '../styles/ReportReasonList.css';

function ReportReasonList({ reasons, value, onSelect }) {
  return (
    <div className="report-reason-list">
      {reasons.map((reason) => {
        const isSelected = value === reason.value;
        return (
          <button
            key={reason.value}
            type="button"
            className={`report-reason-item${isSelected ? ' report-reason-item--selected' : ''}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(reason.value)}
          >
            <span className="report-reason-radio" />
            {reason.label}
          </button>
        );
      })}
    </div>
  );
}

export default ReportReasonList;
