import chatbotCharacter from '../assets/chatbot.svg';
import '../styles/AiLoading.css';

function AiLoading({ title = 'AI가 생각중이에요', description = '잠시만 기다려주세요' }) {
  return (
    <div className="ai-loading">
      <div className="ai-loading-character">
        <span className="ai-loading-glow ai-loading-glow--1" />
        <span className="ai-loading-glow ai-loading-glow--2" />
        <span className="ai-loading-glow ai-loading-glow--3" />
        <img src={chatbotCharacter} alt="" className="ai-loading-icon" />
      </div>

      <p className="ai-loading-text">
        {title}
        <br />
        {description}
      </p>

      <div className="ai-loading-dots" role="status" aria-label="로딩 중">
        <span className="ai-loading-dot" />
        <span className="ai-loading-dot" />
        <span className="ai-loading-dot" />
      </div>
    </div>
  );
}

export default AiLoading;
