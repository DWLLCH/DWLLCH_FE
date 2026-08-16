import '../styles/ChatTypingIndicator.css';

function ChatTypingIndicator() {
  return (
    <div className="chat-typing" role="status" aria-label="AI 챗봇이 답변을 준비 중이에요">
      <span className="chat-typing-dot" />
      <span className="chat-typing-dot" />
      <span className="chat-typing-dot" />
    </div>
  );
}

export default ChatTypingIndicator;
