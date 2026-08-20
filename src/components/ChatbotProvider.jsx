import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  INITIAL_MESSAGES,
  MAX_ATTACH_COUNT,
  getAttachmentReply,
  getBotReply,
} from '../constants/chatbot';
import { createRiskCheckSession, getRiskCheckSession } from '../api/chat';
import { getAccessToken } from '../api/auth';

export const ChatbotContext = createContext(null);

const BOT_REPLY_DELAY = 800;

// 새로고침해도 진행 중이던 위기판독(직접 입력 상담) 세션을 이어갈 수 있도록 탭 단위로 저장
const RISK_CHECK_SESSION_KEY = 'dwllch_riskCheckSessionId';

// "직접 입력"을 선택해서 본인 상황을 자유롭게 설명하는 동안만 위기판독 흐름으로 봄
// 메뉴로 돌아가면 초기화됨, MENU_OPTIONS의 manual-input 값과 맞춰둠 (constants/chatbot.js 참고)
const RISK_CHECK_ENTER_VALUES = ['manual-input'];
const RISK_CHECK_EXIT_VALUES = ['back-to-menu'];

function createId(counterRef) {
  counterRef.current += 1;
  return `msg-${counterRef.current}`;
}

function ChatbotProvider({ children }) {
  const [messages, setMessages] = useState(() =>
    INITIAL_MESSAGES.map((message, index) => ({ ...message, id: message.id || `init-${index}` })),
  );
  const [isTyping, setIsTyping] = useState(false);
  const [riskCheckSessionId, setRiskCheckSessionId] = useState(null);
  const [riskCheckStatus, setRiskCheckStatus] = useState(null);

  const idCounterRef = useRef(0);
  const initialCountRef = useRef(INITIAL_MESSAGES.length);
  const objectUrlsRef = useRef([]);
  const timeoutRef = useRef(null);
  const isRiskCheckFlowRef = useRef(false);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  // 탭에 이미 만들어둔 위기판독 세션이 남아있으면(새로고침 등) 그대로 이어서 조회함
  useEffect(() => {
    const storedId = sessionStorage.getItem(RISK_CHECK_SESSION_KEY);
    if (!storedId || !getAccessToken()) return;

    getRiskCheckSession(storedId)
      .then((session) => {
        setRiskCheckSessionId(session.id);
        setRiskCheckStatus(session.status);
      })
      .catch(() => {
        // 세션이 이미 종료됐거나 다른 계정 것이면 조용히 정리하고 다음에 새로 만듦
        sessionStorage.removeItem(RISK_CHECK_SESSION_KEY);
      });
  }, []);

  const appendMessages = useCallback((drafts) => {
    const withIds = drafts.map((draft) => ({ ...draft, id: createId(idCounterRef) }));
    setMessages((prev) => [...prev, ...withIds]);
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

  // 위기판독 세션이 아직 없으면 새로 만들고, 이미 있으면 그대로 재사용함
  // (메시지 전송/AI 분석 연동은 다음 브랜치 몫이라 여기서는 세션만 준비해둠)
  const ensureRiskCheckSession = useCallback(async () => {
    if (riskCheckSessionId) return riskCheckSessionId;
    if (!getAccessToken()) return null;

    try {
      const session = await createRiskCheckSession();
      setRiskCheckSessionId(session.id);
      setRiskCheckStatus(session.status);
      sessionStorage.setItem(RISK_CHECK_SESSION_KEY, String(session.id));
      return session.id;
    } catch {
      // 세션 생성은 백그라운드 준비 작업이라 실패해도 지금 보여지는 목업 상담 흐름을 막지 않음
      // 다음 브랜치(메시지 전송 연동)에서 실제 전송 시점에 다시 시도하면 됨
      return null;
    }
  }, [riskCheckSessionId]);

  const clearQuickReplies = useCallback((messageId) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, quickReplies: null } : message,
      ),
    );
  }, []);

  const enterChat = useCallback(() => {
    const dividerId = createId(idCounterRef);
    setMessages((prev) => {
      if (prev.length <= initialCountRef.current) return prev;
      const last = prev[prev.length - 1];
      if (last?.type === 'divider') return prev;
      return [...prev, { id: dividerId, sender: 'system', type: 'divider', text: '이전 대화' }];
    });
  }, []);

  const selectQuickReply = useCallback(
    (messageId, option) => {
      clearQuickReplies(messageId);

      if (RISK_CHECK_ENTER_VALUES.includes(option.value)) {
        isRiskCheckFlowRef.current = true;
      } else if (RISK_CHECK_EXIT_VALUES.includes(option.value)) {
        isRiskCheckFlowRef.current = false;
      }

      if (option.value === 'manual-input') {
        ensureRiskCheckSession();
        respondWithDelay(() => getBotReply({ optionValue: option.value }));
        return;
      }

      appendMessages([{ sender: 'user', text: option.label }]);
      respondWithDelay(() => getBotReply({ optionValue: option.value }));
    },
    [appendMessages, clearQuickReplies, respondWithDelay, ensureRiskCheckSession],
  );

  const submitText = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      appendMessages([{ sender: 'user', text: trimmed }]);
      // 직접 입력 선택 시점에 세션 생성을 이미 시도했지만, 그때 실패했을 수 있어 전송 시점에 한 번 더 보장함
      if (isRiskCheckFlowRef.current) ensureRiskCheckSession();
      respondWithDelay(() => getBotReply({ freeText: trimmed }));
    },
    [appendMessages, respondWithDelay, ensureRiskCheckSession],
  );

  const attachImages = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      const drafts = files.slice(0, MAX_ATTACH_COUNT).map((file) => {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        return { sender: 'user', type: 'image', imageUrl: url, fileName: file.name };
      });
      appendMessages(drafts);
      if (isRiskCheckFlowRef.current) ensureRiskCheckSession();
      respondWithDelay(() => getAttachmentReply());
    },
    [appendMessages, respondWithDelay, ensureRiskCheckSession],
  );

  const attachFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      const drafts = files.slice(0, MAX_ATTACH_COUNT).map((file) => {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        return { sender: 'user', type: 'file', fileName: file.name, fileUrl: url };
      });
      appendMessages(drafts);
      if (isRiskCheckFlowRef.current) ensureRiskCheckSession();
      respondWithDelay(() => getAttachmentReply());
    },
    [appendMessages, respondWithDelay, ensureRiskCheckSession],
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
        riskCheckSessionId,
        riskCheckStatus,
      }}
    >
      {children || <Outlet />}
    </ChatbotContext.Provider>
  );
}

export default ChatbotProvider;
