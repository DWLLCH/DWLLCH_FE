import arrow2Right from '../assets/arrow2_right.svg';
import homeCardImage from '../assets/home_card.svg';
import '../styles/HomeCard.css';

function HomeCard({ theme, title, descLines, ctaLabel = '지금 확인하러 가기', onClick }) {
  return (
    <div className={`home-card home-card--${theme}`}>
      <div className="home-card-top">
        <div className="home-card-text">
          <p className="home-card-title">{title}</p>
          <p className="home-card-desc">
            {descLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>
        <img src={homeCardImage} alt="" className="home-card-illustration" />
      </div>
      <button type="button" className="home-card-cta" onClick={onClick}>
        <span>{ctaLabel}</span>
        <span className="home-card-cta-circle">
          <img src={arrow2Right} alt="" />
        </span>
      </button>
    </div>
  );
}

export default HomeCard;
