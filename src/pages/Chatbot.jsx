import { Fragment, useEffect, useRef, useState } from 'react';
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
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    enterChat();
  }, [enterChat]);

  useEffect(() => {
    if (!hasInteractedRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  const handleTextSubmit = () => {
    hasInteractedRef.current = true;
    submitText(inputValue);
    setInputValue('');
  };

  const handleQuickReply = (messageId, option) => {
    hasInteractedRef.current = true;
    selectQuickReply(messageId, option);
  };

  const handleAttachImages = (files) => {
    hasInteractedRef.current = true;
    attachImages(files);
  };

  const handleAttachFiles = (files) => {
    hasInteractedRef.current = true;
    attachFiles(files);
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
            <Fragment key={group.items[0].id}>
              <div className={`chatbot-row chatbot-row--${group.sender}`}>
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
                      fileUrl={message.fileUrl}
                      structured={message.structured}
                      tail={group.sender === 'bot' && index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* 사용자가 다음에 고를 법한 말풍선처럼 보이도록, 퀵리플라이는 봇 말풍선이 아니라
                  사용자 쪽(우측) 정렬로 따로 빼서 보여줌 */}
              {group.items.map((message) =>
                message.quickReplies && message.quickReplies.length > 0 ? (
                  <div key={`${message.id}-quick-replies`} className="chatbot-quick-replies-row">
                    {message.quickReplies.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="chat-quick-reply"
                        onClick={() => handleQuickReply(message.id, option)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null,
              )}
            </Fragment>
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
        onSelectImages={handleAttachImages}
        onSelectFiles={handleAttachFiles}
      />
    </div>
  );
}

export default Chatbot;
