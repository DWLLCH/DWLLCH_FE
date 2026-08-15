import { useState } from 'react';
import '../styles/PollCard.css';

function PollCard({ poll }) {
  const [voted, setVoted] = useState(Boolean(poll.votes));
  const [selected, setSelected] = useState([]);
  const [voteCounts, setVoteCounts] = useState(() => poll.votes || poll.options.map(() => 0));
  const [voterCount, setVoterCount] = useState(
    () => poll.voterCount ?? (poll.votes || []).reduce((sum, count) => sum + count, 0),
  );

  const toggleOption = (index) => {
    if (poll.allowMultiple) {
      setSelected((prev) =>
        prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index],
      );
    } else {
      setSelected([index]);
    }
  };

  const handleVote = () => {
    if (selected.length === 0) return;
    setVoteCounts((prev) =>
      prev.map((count, index) => (selected.includes(index) ? count + 1 : count)),
    );
    setVoterCount((prev) => prev + 1);
    setVoted(true);
  };

  return (
    <div className="poll-card">
      <p className="poll-card-question">{poll.question}</p>

      <div className="poll-card-options">
        {poll.options.map((option, index) =>
          voted ? (
            <div className="poll-card-result" key={index}>
              <div
                className="poll-card-result-bar"
                style={{
                  width: `${voterCount === 0 ? 0 : Math.round((voteCounts[index] / voterCount) * 100)}%`,
                }}
              />
              <div className="poll-card-result-content">
                <span className="poll-card-result-label">{option}</span>
                <span className="poll-card-result-percent">
                  {voterCount === 0 ? 0 : Math.round((voteCounts[index] / voterCount) * 100)}%
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              key={index}
              className={`poll-card-option${selected.includes(index) ? ' poll-card-option--selected' : ''}`}
              onClick={() => toggleOption(index)}
              aria-pressed={selected.includes(index)}
            >
              {option}
            </button>
          ),
        )}
      </div>

      <div className="poll-card-footer">
        {voterCount > 0 && <span className="poll-card-count">{voterCount}명 참여</span>}
        {!voted && (
          <button
            type="button"
            className="poll-card-submit"
            onClick={handleVote}
            disabled={selected.length === 0}
          >
            투표하기
          </button>
        )}
      </div>
    </div>
  );
}

export default PollCard;
