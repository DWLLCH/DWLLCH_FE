import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import BriefingBulletTable from '../components/BriefingBulletTable';
import Modal from '../components/Modal';
import ChatbotButton from '../components/ChatbotButton';
import AiLoading from '../components/AiLoading';
import ErrorState from '../components/ErrorState';
import { getBriefingDetail } from '../api/briefing';
import {
  BRIEFING_ICONS,
  BRIEFING_SECTION_META,
  findRelatedBulletText,
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
  const requestIdRef = useRef(0);
  const [showHint, setShowHint] = useState(false);

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  // ### 하위 항목(briefing-link-chip) 클릭 시 본문을 보여줄 모달 상태 (### 마다 별도로 열림)
  // introText는 상위 ## 섹션 개요 불릿 중 이 항목과 겹치는 단어가 가장 많은 불릿의 설명 텍스트이고
  // body는 ### 항목 자체의 상세 불릿임, 모달 상단에 introText(텍스트) → 그 아래 body(표) 순서로 보여줌
  // 최종 리스트/네비게이션 UI가 아직 미확정이라 우선 모달로 임시 처리함
  const [activeSubItem, setActiveSubItem] = useState(null);

  // 로딩 화면(AiLoading)은 이제 고정 대기 시간이 아니라 실제 상세 조회 fetch가 끝날 때까지 유지됨
  // requestId로 이전 요청(재시도 연타, briefingId 변경 등) 응답이 늦게 도착해도 최신 요청 결과만 반영함
  const loadDetail = useCallback(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);
    setError(null);
    setNotFound(false);
    getBriefingDetail(briefingId)
      .then((data) => {
        if (requestIdRef.current !== requestId) return;
        setDetail(data);
      })
      .catch((err) => {
        if (requestIdRef.current !== requestId) return;
        if (err.response?.status === 404) setNotFound(true);
        else setError('브리핑을 불러오지 못했어요');
      })
      .finally(() => {
        if (requestIdRef.current !== requestId) return;
        setIsLoading(false);
      });
  }, [briefingId]);

  useEffect(() => {
    setShowHint(false);
    setActiveSubItem(null);
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    loadDetail();
  }, [loadDetail]);

  useEffect(
    () => () => {
      // 언마운트 후 도착하는 응답은 무시 (진행 중이던 요청의 requestId를 더 이상 유효하지 않게 만듦)
      requestIdRef.current += 1;
    },
    [],
  );

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
            {/* ###(하위 항목)이 있는 섹션은 개요 불릿을 여기 바로 표시하지 않고 칩을 눌렀을 때 모달 상단에 보여줌 */}
            {sub.subItems.length === 0 && <BriefingBulletTable body={sub.body} />}

            {sub.subItems.length > 0 && (
              <div className="briefing-detail-chip-list">
                {sub.subItems.map((item) => (
                  <BriefingLinkChip
                    key={item.title}
                    label={item.title}
                    onClick={() =>
                      setActiveSubItem({
                        ...item,
                        introText: findRelatedBulletText(sub.body, item.title),
                      })
                    }
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
          {activeSubItem?.introText && (
            <p className="briefing-detail-modal-intro">{activeSubItem.introText}</p>
          )}
          <BriefingBulletTable body={activeSubItem?.body} />
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
