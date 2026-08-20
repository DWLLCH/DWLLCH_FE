import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BACK_TO_MENU_OPTION,
  CONNECT_TARGET_LABELS,
  CONNECT_TARGET_OPTIONS,
  INITIAL_MESSAGES,
  MAX_ATTACH_COUNT,
  MENU_OPTIONS,
  RISK_CHECK_CONNECT_PREFIX,
  RISK_CHECK_STRUCTURE_VALUE,
  STRUCTURE_REQUEST_OPTION,
  getBotReply,
  getGreetingText,
} from '../constants/chatbot';
import {
  connectRiskCheckSession,
  createRiskCheckSession,
  getRiskCheckSession,
  sendRiskCheckMessage,
  structureRiskCheckSession,
} from '../api/chat';
import { getPolicyChatbotAnswer } from '../api/policy';
import { getMyProfile } from '../api/mypage';
import { getAccessToken } from '../api/auth';

export const ChatbotContext = createContext(null);

const BOT_REPLY_DELAY = 800;

// 답변 메시지와 메인 메뉴 질문이 동시에 뜨지 않도록, 메뉴는 답변이 보이고 나서 이 시간만큼 텀을 두고 붙임
const MENU_PROMPT_DELAY_MS = 900;

// 새로고침해도 진행 중이던 위기판독(직접 입력 상담) 세션을 이어갈 수 있도록 탭 단위로 저장
const RISK_CHECK_SESSION_KEY = 'dwllch_riskCheckSessionId';

// 마지막으로 위기판독 세션을 사용한 시각, 일정 시간 응답이 없으면 세션을 끊고 새로 시작하기 위해 씀
const RISK_CHECK_LAST_ACTIVITY_KEY = 'dwllch_riskCheckLastActivity';
const RISK_CHECK_IDLE_TIMEOUT_MS = 60 * 60 * 1000;

// "직접 입력"을 선택해서 본인 상황을 자유롭게 설명하는 동안만 위기판독 흐름으로 봄
// 메뉴로 돌아가면 초기화됨, MENU_OPTIONS의 manual-input 값과 맞춰둠 (constants/chatbot.js 참고)
const RISK_CHECK_ENTER_VALUES = ['manual-input'];
const RISK_CHECK_EXIT_VALUES = ['back-to-menu'];

// "제도 관련 질문이 있어요"를 선택해서 자유롭게 질문하는 동안만 제도 챗봇 흐름으로 봄
// 위기판독과 달리 세션이 없는 단발성 질문/답변이라 로그인 여부와 무관하게 동작함
const POLICY_QA_ENTER_VALUES = ['ask-policy'];

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
  const isPolicyQaFlowRef = useRef(false);
  // 세션당 한 번만 자동으로 상황 정리 카드를 붙이기 위한 플래그, 새 세션을 만들 때 초기화됨
  const hasAutoStructuredRef = useRef(false);
  // ensureRiskCheckSession이 riskCheckSessionId(state)를 직접 읽으면, 이미지 여러 장을 한 번에
  // 보낼 때처럼 같은 콜백 클로저를 재사용하는 상황에서 state 갱신 전 값을 계속 참조할 수 있음
  // 항상 최신 세션 id를 보게 하려고 ref로 따로 들고 있고, state와 세트로 갱신함
  const activeSessionIdRef = useRef(null);
  // 세션 생성이 진행 중일 때 새로 생성 요청이 겹치면(이미지 여러 장 동시 첨부 등) 같은 Promise를
  // 같이 기다리게 해서 세션이 여러 개로 쪼개지는 걸 막음
  const pendingSessionPromiseRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  // 첫 인사말에 실제 이름을 넣어주기 위해 로그인 상태면 프로필을 조회해서 인사말을 갈아끼움
  useEffect(() => {
    if (!getAccessToken()) return;

    getMyProfile()
      .then((profile) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === 'greeting'
              ? { ...message, text: getGreetingText(profile.username) }
              : message,
          ),
        );
      })
      .catch(() => {
        // 이름을 못 가져와도 기본 인사말("회원님")을 그대로 유지함
      });
  }, []);

  // 탭에 이미 만들어둔 위기판독 세션이 남아있으면(새로고침 등) 그대로 이어서 조회함
  useEffect(() => {
    const storedId = sessionStorage.getItem(RISK_CHECK_SESSION_KEY);
    if (!storedId || !getAccessToken()) return;

    getRiskCheckSession(storedId)
      .then((session) => {
        activeSessionIdRef.current = session.id;
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

  // 답변 뒤에 메인 메뉴 질문을 살짝 텀을 두고 붙여서 순서대로 이어지는 것처럼 보이게 함
  // (제도 질문 답변, 추천 기준 안내 등 답변 후 바로 메뉴로 이어지는 흐름에서 공통으로 씀)
  const showMenuPromptWithDelay = useCallback(() => {
    setIsTyping(true);
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      appendMessages([
        { sender: 'bot', title: '무엇이 궁금하신가요?', quickReplies: MENU_OPTIONS },
      ]);
    }, MENU_PROMPT_DELAY_MS);
  }, [appendMessages]);

  const ensureRiskCheckSession = useCallback(async () => {
    if (!getAccessToken()) return null;

    const lastActivity = Number(sessionStorage.getItem(RISK_CHECK_LAST_ACTIVITY_KEY));
    const isIdleExpired =
      activeSessionIdRef.current &&
      lastActivity &&
      Date.now() - lastActivity > RISK_CHECK_IDLE_TIMEOUT_MS;

    if (isIdleExpired) {
      sessionStorage.removeItem(RISK_CHECK_SESSION_KEY);
      sessionStorage.removeItem(RISK_CHECK_LAST_ACTIVITY_KEY);
      activeSessionIdRef.current = null;
      pendingSessionPromiseRef.current = null;
      setRiskCheckSessionId(null);
      setRiskCheckStatus(null);
      hasAutoStructuredRef.current = false;
      appendMessages([
        {
          sender: 'bot',
          text: '일정 시간이 지나, 보안을 위해 이전 대화와 분리하여 새로운 상담을 준비합니다.',
        },
      ]);
    } else if (activeSessionIdRef.current) {
      sessionStorage.setItem(RISK_CHECK_LAST_ACTIVITY_KEY, String(Date.now()));
      return activeSessionIdRef.current;
    }

    // 이미 세션 생성이 진행 중이면 새로 또 만들지 않고 같은 Promise를 같이 기다림
    if (pendingSessionPromiseRef.current) {
      return pendingSessionPromiseRef.current;
    }

    const creationPromise = (async () => {
      try {
        const session = await createRiskCheckSession();
        activeSessionIdRef.current = session.id;
        setRiskCheckSessionId(session.id);
        setRiskCheckStatus(session.status);
        sessionStorage.setItem(RISK_CHECK_SESSION_KEY, String(session.id));
        sessionStorage.setItem(RISK_CHECK_LAST_ACTIVITY_KEY, String(Date.now()));
        hasAutoStructuredRef.current = false;
        return session.id;
      } catch {
        // 세션 생성 실패는 sendRiskCheckTurn 쪽에서 안내 메시지로 처리함
        return null;
      } finally {
        pendingSessionPromiseRef.current = null;
      }
    })();

    pendingSessionPromiseRef.current = creationPromise;
    return creationPromise;
  }, [appendMessages]);

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

        // BE가 6항목(날짜/금액/장소/상대방/상황요약/위험유형) 수집이 끝났다고 판단하면
        // readyForStructure를 내려줌, 세션당 한 번만 자동으로 카드를 먼저 붙이고 답변을 이어붙임
        // (같은 analyze_risk 호출 안에서 같이 오는 값이라 Gemini 호출은 늘지 않음)
        const botMessages = [];

        if (result.analysisResult?.readyForStructure && !hasAutoStructuredRef.current) {
          try {
            const structured = await structureRiskCheckSession(sessionId);
            hasAutoStructuredRef.current = true;
            botMessages.push({
              sender: 'bot',
              type: 'structured-summary',
              structured: {
                report: structured.structuredReport,
                riskGrade: structured.riskGrade,
                missingFields: structured.missingFields,
              },
            });
          } catch {
            // 자동 정리에 실패해도 아래 답변 메시지는 그대로 보여줌, 정리해줘 버튼으로 재시도 가능
          }
        }

        botMessages.push({
          sender: 'bot',
          text: result.reply,
          quickReplies: [...suggestedReplies, ...STRUCTURE_REQUEST_OPTION, ...BACK_TO_MENU_OPTION],
        });

        setIsTyping(false);
        appendMessages(botMessages);
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
      hasAutoStructuredRef.current = true;
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

  // 제도 관련 자유 질문 답변, 세션 없이 질문 하나당 AI 답변 하나를 바로 받아옴 (로그인 불필요)
  const sendPolicyQuestion = useCallback(
    async (question) => {
      setIsTyping(true);

      try {
        const result = await getPolicyChatbotAnswer(question);
        setIsTyping(false);

        // answerable이 false면 가진 정책 정보로는 확답할 수 없다는 뜻이라 별도 안내를 덧붙임
        const botMessages = [{ sender: 'bot', text: result.answer }];
        if (!result.answerable) {
          botMessages.push({
            sender: 'bot',
            text: '정확한 정보로 답변드리기 어려운 질문이었어요. 관련 기관이나 담당자에게 직접 문의해보시는 걸 추천드려요.',
          });
        }
        isPolicyQaFlowRef.current = false;

        appendMessages(botMessages);
        // 답변 후 메뉴 칩 대신 메인 메뉴 질문을 텀을 두고 이어붙여서 다음 흐름으로 자연스럽게 유도함
        showMenuPromptWithDelay();
      } catch (error) {
        setIsTyping(false);
        const message =
          error.response?.data?.message || 'AI 답변 생성에 실패했어요. 잠시 후 다시 시도해주세요';
        // 같은 자리에서 다시 물어볼 수 있게 메뉴로 돌아가기는 보여주지 않음
        appendMessages([{ sender: 'bot', text: message }]);
      }
    },
    [appendMessages, showMenuPromptWithDelay],
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
        isPolicyQaFlowRef.current = false;
      } else if (POLICY_QA_ENTER_VALUES.includes(option.value)) {
        isPolicyQaFlowRef.current = true;
        isRiskCheckFlowRef.current = false;
      } else if (RISK_CHECK_EXIT_VALUES.includes(option.value)) {
        isRiskCheckFlowRef.current = false;
        isPolicyQaFlowRef.current = false;
      }

      if (option.value === 'manual-input') {
        ensureRiskCheckSession();
        respondWithDelay(() => getBotReply({ optionValue: option.value }));
        return;
      }

      if (option.value === 'ask-policy') {
        respondWithDelay(() => getBotReply({ optionValue: option.value }));
        return;
      }

      if (option.value === 'recommend-criteria') {
        appendMessages([{ sender: 'user', text: option.label }]);
        setIsTyping(true);
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          appendMessages(getBotReply({ optionValue: option.value }));
          // 답변이 보이고 나서 텀을 두고 메인 메뉴 질문을 이어붙임
          showMenuPromptWithDelay();
        }, BOT_REPLY_DELAY);
        return;
      }

      appendMessages([{ sender: 'user', text: option.label }]);
      respondWithDelay(() => getBotReply({ optionValue: option.value }));
    },
    [
      appendMessages,
      clearQuickReplies,
      showMenuPromptWithDelay,
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

      if (isPolicyQaFlowRef.current) {
        sendPolicyQuestion(trimmed);
        return;
      }

      // 메뉴 선택 없이 사용자가 먼저 말을 걸어도 위기판독 상담으로 봄
      // ("직접 입력하기" 메뉴 칩이 빠지면서 이게 사실상의 진입점이 됨)
      isRiskCheckFlowRef.current = true;
      sendRiskCheckTurn({ type: 'TEXT', content: trimmed });
    },
    [appendMessages, sendRiskCheckTurn, sendPolicyQuestion],
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

      // 이미지 분석은 위기판독에서만 지원해서, 메뉴 선택 여부와 상관없이 위기판독 상담으로 봄
      isRiskCheckFlowRef.current = true;
      isPolicyQaFlowRef.current = false;

      // 이미지 한 장당 AI 분석 한 턴, 여러 장이면 순서대로 이어서 보냄
      limitedFiles.reduce(
        (chain, file) => chain.then(() => sendRiskCheckTurn({ type: 'IMAGE', file })),
        Promise.resolve(),
      );
    },
    [appendMessages, sendRiskCheckTurn],
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

      // 이미지 분석은 위기판독에서만 지원해서, 메뉴 선택 여부와 상관없이 위기판독 상담으로 봄
      isRiskCheckFlowRef.current = true;
      isPolicyQaFlowRef.current = false;

      // 위기판독 분석은 이미지 파일만 지원해서(BE MessageCreateSerializer), 일반 파일은 분석을 못 붙임
      // 상담을 끝내려는 게 아니라 사진으로 다시 첨부하고 싶을 확률이 높아서 메뉴로 돌아가기는 안 보여줌
      appendMessages([
        {
          sender: 'bot',
          text: '위기판독 상담에서는 이미지 파일만 확인할 수 있어요. 사진으로 다시 첨부해주세요.',
        },
      ]);
    },
    [appendMessages],
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
