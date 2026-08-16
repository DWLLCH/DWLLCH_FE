import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import chatbotAvatar from '../assets/chatbot2.svg';
import ChatBubble from '../components/ChatBubble';
import ChatTypingIndicator from '../components/ChatTypingIndicator';
import ChatInputBar from '../components/ChatInputBar';
import ChatAttachSheet from '../components/ChatAttachSheet';
import useChatbot from '../hooks/useChatbot';
import { CHATBOT_NAME } from '../constants/chatbot';
import '../styles/Chatbot.css';

function groupMessages(messages) {
  const groups = [];
  messages.forEach((message) => {
    const lastGroup = groups[groups.length - 1];
    if (message.type === 'divider') {
      groups.push({ sender: 'divider', items: [message] });
      return;
    }
    if (lastGroup && lastGroup.sender === message.sender) {
      lastGroup.items.push(message);
    } else {
      groups.push({ sender: message.sender, items: [message] });
    }
  });
  return groups;
}

function Chatbot() {
  const navigate = useNavigate();
  const { messages, isTyping, enterChat, selectQuickReply, submitText, attachImages, attachFiles } =
    useChatbot();
  const [inputValue, setInputValue] = useState('');
  const [attachOpen, setAttachOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    enterChat();
  }, [enterChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  const handleTextSubmit = () => {
    submitText(inputValue);
    setInputValue('');
  };

  const groups = groupMessages(messages);

  return (
    <div className="chatbot-page">
      <header className="chatbot-header">
        <button
          type="button"
          className="chatbot-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>{CHATBOT_NAME}</h1>
      </header>

      <div className="chatbot-body">
        {groups.map((group) => {
          if (group.sender === 'divider') {
            return (
              <div key={group.items[0].id} className="chatbot-divider">
                <span>{group.items[0].text}</span>
              </div>
            );
          }

          return (
            <div key={group.items[0].id} className={`chatbot-row chatbot-row--${group.sender}`}>
              {group.sender === 'bot' && (
                <img src={chatbotAvatar} alt="" className="chatbot-avatar" />
              )}
              <div className="chatbot-bubble-col">
                {group.items.map((message, index) => (
                  <ChatBubble
                    key={message.id}
                    sender={message.sender}
                    title={message.title}
                    text={message.text}
                    type={message.type}
                    imageUrl={message.imageUrl}
                    fileName={message.fileName}
                    quickReplies={message.quickReplies}
                    tail={group.sender === 'bot' && index === 0}
                    onSelectQuickReply={(option) => selectQuickReply(message.id, option)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="chatbot-row chatbot-row--bot">
            <img src={chatbotAvatar} alt="" className="chatbot-avatar" />
            <div className="chatbot-bubble-col">
              <ChatTypingIndicator />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInputBar
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleTextSubmit}
        onAttachClick={() => setAttachOpen(true)}
        disabled={isTyping}
      />

      <ChatAttachSheet
        open={attachOpen}
        onClose={() => setAttachOpen(false)}
        onSelectImages={attachImages}
        onSelectFiles={attachFiles}
      />
    </div>
  );
}

export default Chatbot;
