import { useState } from 'react';
import '../styles/PollCard.css';

function PollCard({ poll, onVote }) {
  const [selected, setSelected] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState('');

  const voted = Boolean(poll.myVotedOptionIds && poll.myVotedOptionIds.length > 0);
  const voterCount = poll.totalVoters ?? 0;

  const toggleOption = (optionId) => {
    if (poll.allowMultiple) {
      setSelected((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
      );
    } else {
      setSelected([optionId]);
    }
  };

  const handleVote = async () => {
    if (selected.length === 0 || isVoting) return;
    setIsVoting(true);
    setVoteError('');
    try {
      await onVote(selected);
    } catch (error) {
      const message = error.response?.data?.message;
      setVoteError(message || '투표에 실패했어요. 다시 시도해주세요');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="poll-card">
      <p className="poll-card-question">{poll.question}</p>

      <div className="poll-card-options">
        {poll.options.map((option) =>
          voted ? (
            <div className="poll-card-result" key={option.id}>
              <div
                className="poll-card-result-bar"
                style={{
                  width: `${voterCount === 0 ? 0 : Math.round((option.voteCount / voterCount) * 100)}%`,
                }}
              />
              <div className="poll-card-result-content">
                <span className="poll-card-result-label">{option.text}</span>
                <span className="poll-card-result-percent">
                  {voterCount === 0 ? 0 : Math.round((option.voteCount / voterCount) * 100)}%
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              key={option.id}
              className={`poll-card-option${selected.includes(option.id) ? ' poll-card-option--selected' : ''}`}
              onClick={() => toggleOption(option.id)}
              aria-pressed={selected.includes(option.id)}
            >
              {option.text}
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
            disabled={selected.length === 0 || isVoting}
          >
            {isVoting ? '투표 중' : '투표하기'}
          </button>
        )}
      </div>

      {voteError && (
        <p className="poll-card-error" role="alert">
          {voteError}
        </p>
      )}
    </div>
  );
}

export default PollCard;
