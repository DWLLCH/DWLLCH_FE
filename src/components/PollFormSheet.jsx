import { useEffect, useState } from 'react';
import BottomSheet from './BottomSheet';
import Toggle from './Toggle';
import Button from './Button';
import '../styles/PollFormSheet.css';

function createOption(value = '') {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, value };
}

function PollFormSheet({ open, onClose, initialValue, onSubmit }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([createOption(), createOption()]);
  const [allowMultiple, setAllowMultiple] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialValue) {
      setQuestion(initialValue.question);
      setOptions(
        initialValue.options.length > 0
          ? initialValue.options.map((value) => createOption(value))
          : [createOption(), createOption()],
      );
      setAllowMultiple(initialValue.allowMultiple);
    } else {
      setQuestion('');
      setOptions([createOption(), createOption()]);
      setAllowMultiple(false);
    }
  }, [open, initialValue]);

  const handleOptionChange = (id, value) => {
    setOptions((prev) => prev.map((option) => (option.id === id ? { ...option, value } : option)));
  };

  const handleAddOption = () => {
    setOptions((prev) => (prev.length >= 10 ? prev : [...prev, createOption()]));
  };

  const handleRemoveOption = (id) => {
    setOptions((prev) => (prev.length <= 2 ? prev : prev.filter((option) => option.id !== id)));
  };

  const filledOptionCount = options.filter((option) => option.value.trim().length > 0).length;
  const canSubmit = question.trim().length > 0 && filledOptionCount >= 2;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      question: question.trim(),
      options: options.map((option) => option.value.trim()).filter(Boolean),
      allowMultiple,
    });
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      footer={
        <Button fullWidth disabled={!canSubmit} onClick={handleSubmit}>
          완료
        </Button>
      }
    >
      <p className="poll-form-heading">투표 만들기</p>

      <div className="poll-form-section">
        <label className="poll-form-label" htmlFor="poll-question-input">
          질문
        </label>
        <div className="poll-form-input-box">
          <input
            id="poll-question-input"
            className="poll-form-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="투표할 질문을 입력해주세요"
            maxLength={100}
          />
        </div>
        <p className="poll-form-counter">{question.length}/100</p>
      </div>

      <div className="poll-form-section">
        <p className="poll-form-label">선택지 (2개 이상)</p>
        <div className="poll-form-options">
          {options.map((option) => (
            <div className="poll-form-option-row" key={option.id}>
              <input
                className="poll-form-option-input"
                value={option.value}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder="선택지를 입력해주세요"
                maxLength={50}
                aria-label="선택지"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  className="poll-form-option-remove"
                  onClick={() => handleRemoveOption(option.id)}
                  aria-label="선택지 삭제"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 10 && (
          <button type="button" className="poll-form-add-option" onClick={handleAddOption}>
            + 선택지 추가
          </button>
        )}
      </div>

      <div className="poll-form-toggle-row">
        <div>
          <p className="poll-form-toggle-title">복수 선택 허용하기</p>
          <p className="poll-form-toggle-desc">여러 개의 선택지를 선택할 수 있어요</p>
        </div>
        <Toggle
          checked={allowMultiple}
          onChange={setAllowMultiple}
          ariaLabel="복수 선택 허용하기"
        />
      </div>
    </BottomSheet>
  );
}

export default PollFormSheet;
