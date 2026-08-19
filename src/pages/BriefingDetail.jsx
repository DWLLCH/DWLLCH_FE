import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import backBtn from '../assets/backBtn.svg';
import one from '../assets/one.svg';
import two from '../assets/two.svg';
import three from '../assets/three.svg';
import four from '../assets/four.svg';
import five from '../assets/five.svg';
import sparkle from '../assets/sparkle.svg';
import star1 from '../assets/star1.svg';
import star2 from '../assets/star2.svg';
import SectionTag from '../components/SectionTag';
import DetailSection from '../components/DetailSection';
import BriefingLinkChip from '../components/BriefingLinkChip';
import Modal from '../components/Modal';
import ChatbotButton from '../components/ChatbotButton';
import AiLoading from '../components/AiLoading';
import ErrorState from '../components/ErrorState';
import { getBriefingDetail } from '../api/briefing';
import {
  BRIEFING_ICONS,
  BRIEFING_SECTION_META,
  getSectionDefaultIcon,
  parseBriefingContent,
} from '../constants/briefing';
import '../styles/BriefingDetail.css';

const NUMBER_ICONS = [one, two, three, four, five];

function BriefingDetail() {
  const navigate = useNavigate();
  const { briefingId } = useParams();
  const bodyRef = useRef(null);
  const hintTimerRef = useRef(null);
  const wasAtBottomRef = useRef(false);
  const [showHint, setShowHint] = useState(false);

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  // ### 하위 항목(briefing-link-chip) 클릭 시 본문을 보여줄 모달 상태
  // 최종 리스트/네비게이션 UI가 아직 미확정이라 우선 모달로 임시 처리함
  const [activeSubItem, setActiveSubItem] = useState(null);

  // 로딩 화면(AiLoading)은 이제 고정 대기 시간이 아니라 실제 상세 조회 fetch가 끝날 때까지 유지됨
  const loadDetail = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    getBriefingDetail(briefingId)
      .then((data) => setDetail(data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else setError('브리핑을 불러오지 못했어요');
      })
      .finally(() => setIsLoading(false));
  }, [briefingId]);

  useEffect(() => {
    setShowHint(false);
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    loadDetail();
  }, [loadDetail]);

  const triggerHint = useCallback(() => {
    setShowHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShowHint(false), 3200);
  }, []);

  useEffect(() => {
    if (isLoading || !detail) return undefined;
    const timer = setTimeout(triggerHint, 800);
    return () => {
      clearTimeout(timer);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [triggerHint, isLoading, detail]);

  if (isLoading) {
    return (
      <div className="briefing-detail-page">
        <AiLoading />
      </div>
    );
  }

  const handleBodyScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 16;
    if (atBottom && !wasAtBottomRef.current) {
      triggerHint();
    }
    wasAtBottomRef.current = atBottom;
  };

  if (notFound) {
    return (
      <div className="briefing-detail-page">
        <header className="briefing-detail-header">
          <button
            type="button"
            className="briefing-detail-back"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <img src={backBtn} alt="" />
          </button>
          <h1>AI 브리핑</h1>
        </header>
        <div className="briefing-detail-notfound">
          <p>콘텐츠를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="briefing-detail-page">
        <header className="briefing-detail-header">
          <button
            type="button"
            className="briefing-detail-back"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <img src={backBtn} alt="" />
          </button>
          <h1>AI 브리핑</h1>
        </header>
        <div className="briefing-detail-notfound">
          <ErrorState message={error ?? '브리핑을 불러오지 못했어요'} onRetry={loadDetail} />
        </div>
      </div>
    );
  }

  const sectionMeta = BRIEFING_SECTION_META.find((meta) => meta.category === detail.category);
  const contentSections = parseBriefingContent(detail.content);

  return (
    <div className="briefing-detail-page">
      <header className="briefing-detail-header">
        <button
          type="button"
          className="briefing-detail-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>AI 브리핑</h1>
      </header>

      <div className="briefing-detail-body" ref={bodyRef} onScroll={handleBodyScroll}>
        <div className="briefing-detail-hero">
          <div className="briefing-detail-hero-top">
            <div className="briefing-detail-hero-text">
              <SectionTag>{sectionMeta?.title ?? detail.category}</SectionTag>
              <p className="briefing-detail-title">{detail.title}</p>
              <p className="briefing-detail-desc">{detail.cardSummary}</p>
            </div>

            <div className="briefing-detail-hero-icon">
              <img
                src={BRIEFING_ICONS[getSectionDefaultIcon(sectionMeta?.id)]}
                alt=""
                className="briefing-detail-hero-icon-img"
              />
              <img src={star1} alt="" className="briefing-detail-star briefing-detail-star--1" />
              <img src={star2} alt="" className="briefing-detail-star briefing-detail-star--2" />
            </div>
          </div>

          <div className="briefing-detail-summary">
            <p className="briefing-detail-summary-title">
              <img src={sparkle} alt="" />
              핵심 요약
            </p>
            <ul className="briefing-detail-summary-list">
              {(detail.keySummary ?? []).map((item) => (
                <li key={item}>
                  <span className="briefing-detail-check" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {contentSections.map((sub, index) => (
          <DetailSection
            key={sub.title || index}
            number={NUMBER_ICONS[Math.min(index, NUMBER_ICONS.length - 1)]}
            title={sub.title || detail.title}
          >
            {sub.body && (
              <div className="briefing-detail-markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ ...props }) => (
                      <div className="briefing-detail-table">
                        <table {...props} />
                      </div>
                    ),
                  }}
                >
                  {sub.body}
                </ReactMarkdown>
              </div>
            )}

            {sub.subItems.length > 0 && (
              <div className="briefing-detail-chip-list">
                {sub.subItems.map((item) => (
                  <BriefingLinkChip
                    key={item.title}
                    label={item.title}
                    onClick={() => setActiveSubItem(item)}
                  />
                ))}
              </div>
            )}
          </DetailSection>
        ))}
      </div>

      <div
        className={`briefing-detail-chatbot-hint${showHint ? ' briefing-detail-chatbot-hint--visible' : ''}`}
      >
        더 궁금한 점이 있다면?
      </div>
      <ChatbotButton onClick={() => navigate('/chatbot')} />

      <Modal
        open={Boolean(activeSubItem)}
        onClose={() => setActiveSubItem(null)}
        title={activeSubItem?.title}
      >
        <div className="briefing-detail-modal-content">
          <div className="briefing-detail-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeSubItem?.body ?? ''}</ReactMarkdown>
          </div>
          <button
            type="button"
            className="modal-btn modal-btn--confirm"
            onClick={() => setActiveSubItem(null)}
          >
            닫기
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default BriefingDetail;
