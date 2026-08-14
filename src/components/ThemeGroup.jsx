import ThemeCard from './ThemeCard';
import '../styles/ThemeGroup.css';

function ThemeGroup({ title, color, cards, onCardClick }) {
  return (
    <div className={`theme-group theme-group--${color}`}>
      <p className="theme-group-title">{title}</p>
      <div className="theme-group-cards">
        {cards.map((card) => (
          <ThemeCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            description={card.description}
            color={color}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ThemeGroup;
