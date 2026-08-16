import '../styles/DetailSection.css';

function DetailSection({ number, title, children }) {
  return (
    <section className="detail-section">
      <div className="detail-section-heading">
        <img src={number} alt="" className="detail-section-number" />
        <h2>{title}</h2>
      </div>
      <div className="detail-section-body">{children}</div>
    </section>
  );
}

export default DetailSection;
