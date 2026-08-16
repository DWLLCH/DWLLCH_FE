import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { INITIAL_MESSAGES, getAttachmentReply, getBotReply } from '../constants/chatbot';

export const ChatbotContext = createContext(null);

const BOT_REPLY_DELAY = 800;

function createId(counterRef) {
  counterRef.current += 1;
  return `msg-${counterRef.current}`;
}

function ChatbotProvider({ children }) {
  const [messages, setMessages] = useState(() =>
    INITIAL_MESSAGES.map((message, index) => ({ ...message, id: message.id || `init-${index}` })),
  );
  const [isTyping, setIsTyping] = useState(false);

  const idCounterRef = useRef(0);
  const initialCountRef = useRef(INITIAL_MESSAGES.length);
  const objectUrlsRef = useRef([]);
  const timeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const appendMessages = useCallback((drafts) => {
    setMessages((prev) => [
      ...prev,
      ...drafts.map((draft) => ({ ...draft, id: createId(idCounterRef) })),
    ]);
  }, []);

  const respondWithDelay = useCallback(
    (buildReplies) => {
      setIsTyping(true);
      timeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        appendMessages(buildReplies());
      }, BOT_REPLY_DELAY);
    },
    [appendMessages],
  );

  const clearQuickReplies = useCallback((messageId) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, quickReplies: null } : message,
      ),
    );
  }, []);

  const enterChat = useCallback(() => {
    setMessages((prev) => {
      if (prev.length <= initialCountRef.current) return prev;
      const last = prev[prev.length - 1];
      if (last?.type === 'divider') return prev;
      return [
        ...prev,
        { id: createId(idCounterRef), sender: 'system', type: 'divider', text: '이전 대화' },
      ];
    });
  }, []);

  const selectQuickReply = useCallback(
    (messageId, option) => {
      clearQuickReplies(messageId);

      if (option.value === 'manual-input') {
        respondWithDelay(() => getBotReply({ optionValue: option.value }));
        return;
      }

      appendMessages([{ sender: 'user', text: option.label }]);
      respondWithDelay(() => getBotReply({ optionValue: option.value }));
    },
    [appendMessages, clearQuickReplies, respondWithDelay],
  );

  const submitText = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      appendMessages([{ sender: 'user', text: trimmed }]);
      respondWithDelay(() => getBotReply({ freeText: trimmed }));
    },
    [appendMessages, respondWithDelay],
  );

  const attachImages = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      const drafts = files.map((file) => {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        return { sender: 'user', type: 'image', imageUrl: url };
      });
      appendMessages(drafts);
      respondWithDelay(() => getAttachmentReply());
    },
    [appendMessages, respondWithDelay],
  );

  const attachFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      appendMessages(files.map((file) => ({ sender: 'user', type: 'file', fileName: file.name })));
      respondWithDelay(() => getAttachmentReply());
    },
    [appendMessages, respondWithDelay],
  );

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        isTyping,
        enterChat,
        selectQuickReply,
        submitText,
        attachImages,
        attachFiles,
      }}
    >
      {children || <Outlet />}
    </ChatbotContext.Provider>
  );
}

export default ChatbotProvider;
