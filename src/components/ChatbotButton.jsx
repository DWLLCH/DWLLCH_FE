import chatbot from '../assets/chatbot.svg';
import '../styles/ChatbotButton.css';

function ChatbotButton({ onClick }) {
  return (
    <button type="button" className="chatbot-btn" onClick={onClick} aria-label="AI 챗봇">
      <img src={chatbot} alt="" />
      <span>AI챗봇</span>
    </button>
  );
}

export default ChatbotButton;
