import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BACK_TO_MENU_OPTION,
  CONNECT_TARGET_LABELS,
  CONNECT_TARGET_OPTIONS,
  INITIAL_MESSAGES,
  MAX_ATTACH_COUNT,
  RISK_CHECK_CONNECT_PREFIX,
  RISK_CHECK_STRUCTURE_VALUE,
  STRUCTURE_REQUEST_OPTION,
  getAttachmentReply,
  getBotReply,
} from '../constants/chatbot';
import {
  connectRiskCheckSession,
  createRiskCheckSession,
  getRiskCheckSession,
  sendRiskCheckMessage,
  structureRiskCheckSession,
} from '../api/chat';
import { getAccessToken } from '../api/auth';

export const ChatbotContext = createContext(null);

const BOT_REPLY_DELAY = 800;

// 새로고침해도 진행 중이던 위기판독(직접 입력 상담) 세션을 이어갈 수 있도록 탭 단위로 저장
const RISK_CHECK_SESSION_KEY = 'dwllch_riskCheckSessionId';

// "직접 입력"을 선택해서 본인 상황을 자유롭게 설명하는 동안만 위기판독 흐름으로 봄
// 메뉴로 돌아가면 초기화됨, MENU_OPTIONS의 manual-input 값과 맞춰둠 (constants/chatbot.js 참고)
const RISK_CHECK_ENTER_VALUES = ['manual-input'];
const RISK_CHECK_EXIT_VALUES = ['back-to-menu'];

// AI가 제안한 답변 칩(quickReply)인지 구분하는 접두사, selectQuickReply에서 분기할 때 씀
const RISK_CHECK_SUGGESTED_PREFIX = 'risk-check-suggested:';

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
      // 세션 생성 실패는 sendRiskCheckTurn 쪽에서 안내 메시지로 처리함
      return null;
    }
  }, [riskCheckSessionId]);

  // 위기판독 대화 한 턴을 실제로 보내고 AI 분석 결과를 봇 말풍선으로 붙임
  const sendRiskCheckTurn = useCallback(
    async ({ type, content = '', file }) => {
      if (!getAccessToken()) {
        appendMessages([
          {
            sender: 'bot',
            text: '로그인 후 이용할 수 있어요. 로그인하고 다시 시도해주세요.',
          },
        ]);
        return;
      }

      setIsTyping(true);

      try {
        const sessionId = await ensureRiskCheckSession();
        if (!sessionId) {
          throw new Error('위기판독 세션을 준비하지 못했습니다.');
        }

        const result = await sendRiskCheckMessage(sessionId, { type, content, file });
        const suggestedReplies = (result.suggestedReplies || []).map((label, index) => ({
          value: `${RISK_CHECK_SUGGESTED_PREFIX}${index}`,
          label,
        }));

        setIsTyping(false);
        appendMessages([
          {
            sender: 'bot',
            text: result.reply,
            quickReplies: [
              ...suggestedReplies,
              ...STRUCTURE_REQUEST_OPTION,
              ...BACK_TO_MENU_OPTION,
            ],
          },
        ]);
      } catch (error) {
        setIsTyping(false);
        const message =
          error.response?.status === 422
            ? '이미지를 다시 촬영하거나 텍스트로 설명해주세요'
            : error.response?.data?.message || 'AI 분석에 실패했어요. 잠시 후 다시 시도해주세요';
        appendMessages([{ sender: 'bot', text: message }]);
      }
    },
    [appendMessages, ensureRiskCheckSession],
  );

  // 지금까지의 대화를 6개 항목(날짜/금액/장소/상대방/상황요약/위험유형)으로 정리해서 카드로 보여줌
  const requestStructuredSummary = useCallback(async () => {
    if (!getAccessToken()) {
      appendMessages([
        { sender: 'bot', text: '로그인 후 이용할 수 있어요. 로그인하고 다시 시도해주세요.' },
      ]);
      return;
    }

    setIsTyping(true);

    try {
      const sessionId = await ensureRiskCheckSession();
      if (!sessionId) {
        throw new Error('위기판독 세션을 준비하지 못했습니다.');
      }

      const result = await structureRiskCheckSession(sessionId);
      setIsTyping(false);
      appendMessages([
        {
          sender: 'bot',
          type: 'structured-summary',
          structured: {
            report: result.structuredReport,
            riskGrade: result.riskGrade,
            missingFields: result.missingFields,
          },
          quickReplies: [...CONNECT_TARGET_OPTIONS, ...BACK_TO_MENU_OPTION],
        },
      ]);
    } catch (error) {
      setIsTyping(false);
      const message =
        error.response?.data?.message || '상황 정리에 실패했어요. 잠시 후 다시 시도해주세요';
      // 여기도 마찬가지로 같은 자리에서 재시도할 수 있게 메뉴로 돌아가기는 보여주지 않음
      appendMessages([{ sender: 'bot', text: message }]);
    }
  }, [appendMessages, ensureRiskCheckSession]);

  // 조력자 연계 칩을 누르는 것 자체를 동의(consent)로 보고 바로 해당 종류로 연계 요청함
  const requestSupportConnection = useCallback(
    async (connectTo) => {
      if (!getAccessToken()) {
        appendMessages([
          { sender: 'bot', text: '로그인 후 이용할 수 있어요. 로그인하고 다시 시도해주세요.' },
        ]);
        return;
      }

      setIsTyping(true);

      try {
        const sessionId = await ensureRiskCheckSession();
        if (!sessionId) {
          throw new Error('위기판독 세션을 준비하지 못했습니다.');
        }

        const result = await connectRiskCheckSession(sessionId, { consent: true, connectTo });
        setIsTyping(false);

        const targetLabel = CONNECT_TARGET_LABELS[connectTo] || '조력자';
        const noticeText = result.notice ? `\n${result.notice}` : '';
        appendMessages([
          {
            sender: 'bot',
            text: `${targetLabel} 연계 요청이 접수됐어요. 곧 연락드릴게요.${noticeText}`,
            quickReplies: BACK_TO_MENU_OPTION,
          },
        ]);
      } catch (error) {
        setIsTyping(false);
        const message =
          error.response?.data?.message || '연계 요청에 실패했어요. 잠시 후 다시 시도해주세요';
        // 여기도 같은 자리에서 다시 시도할 수 있게 메뉴로 돌아가기는 보여주지 않음
        appendMessages([{ sender: 'bot', text: message }]);
      }
    },
    [appendMessages, ensureRiskCheckSession],
  );

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

      // AI가 제안한 답변 칩은 메뉴 옵션이 아니라 사용자가 그 문장을 그대로 입력한 것과 같음
      if (option.value.startsWith(RISK_CHECK_SUGGESTED_PREFIX)) {
        appendMessages([{ sender: 'user', text: option.label }]);
        sendRiskCheckTurn({ type: 'TEXT', content: option.label });
        return;
      }

      if (option.value === RISK_CHECK_STRUCTURE_VALUE) {
        appendMessages([{ sender: 'user', text: option.label }]);
        requestStructuredSummary();
        return;
      }

      if (option.value.startsWith(RISK_CHECK_CONNECT_PREFIX)) {
        appendMessages([{ sender: 'user', text: option.label }]);
        requestSupportConnection(option.value.slice(RISK_CHECK_CONNECT_PREFIX.length));
        return;
      }

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
    [
      appendMessages,
      clearQuickReplies,
      respondWithDelay,
      ensureRiskCheckSession,
      sendRiskCheckTurn,
      requestStructuredSummary,
      requestSupportConnection,
    ],
  );

  const submitText = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      appendMessages([{ sender: 'user', text: trimmed }]);

      if (isRiskCheckFlowRef.current) {
        sendRiskCheckTurn({ type: 'TEXT', content: trimmed });
        return;
      }

      respondWithDelay(() => getBotReply({ freeText: trimmed }));
    },
    [appendMessages, respondWithDelay, sendRiskCheckTurn],
  );

  const attachImages = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      const limitedFiles = files.slice(0, MAX_ATTACH_COUNT);
      const drafts = limitedFiles.map((file) => {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        return { sender: 'user', type: 'image', imageUrl: url, fileName: file.name };
      });
      appendMessages(drafts);

      if (isRiskCheckFlowRef.current) {
        // 이미지 한 장당 AI 분석 한 턴, 여러 장이면 순서대로 이어서 보냄
        limitedFiles.reduce(
          (chain, file) => chain.then(() => sendRiskCheckTurn({ type: 'IMAGE', file })),
          Promise.resolve(),
        );
        return;
      }

      respondWithDelay(() => getAttachmentReply());
    },
    [appendMessages, respondWithDelay, sendRiskCheckTurn],
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

      if (isRiskCheckFlowRef.current) {
        // 위기판독 분석은 이미지 파일만 지원해서(BE MessageCreateSerializer), 일반 파일은 분석을 못 붙임
        // 상담을 끝내려는 게 아니라 사진으로 다시 첨부하고 싶을 확률이 높아서 메뉴로 돌아가기는 안 보여줌
        appendMessages([
          {
            sender: 'bot',
            text: '위기판독 상담에서는 이미지 파일만 확인할 수 있어요. 사진으로 다시 첨부해주세요.',
          },
        ]);
        return;
      }

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
        riskCheckSessionId,
        riskCheckStatus,
      }}
    >
      {children || <Outlet />}
    </ChatbotContext.Provider>
  );
}

export default ChatbotProvider;
