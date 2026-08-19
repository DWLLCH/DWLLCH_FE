import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import FilterChip from '../components/FilterChip';
import DropdownTrigger from '../components/DropdownTrigger';
import PolicyCard from '../components/PolicyCard';
import ChatbotButton from '../components/ChatbotButton';
import BottomSheet from '../components/BottomSheet';
import SortMenu from '../components/SortMenu';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { getPolicies } from '../api/policy';
import { formatDday, toPolicyLevel } from '../utils/formatters';
import {
  FILTER_GROUPS,
  FILTER_VALUE_MAP,
  SORT_OPTIONS,
  SORT_VALUE_MAP,
} from '../constants/filterOptions';
import '../styles/SupportList.css';

const PAGE_SIZE = 20;

// 선택된 필터 라벨(appliedFilters)을 GET /policies 쿼리 파라미터로 변환
// 같은 그룹(param) 내 복수 선택은 콤마로 이어서 AND 조건으로 전달함
function buildFilterParams(appliedFilters) {
  const params = {};
  appliedFilters.forEach((label) => {
    const entry = FILTER_VALUE_MAP[label];
    if (!entry) return;
    params[entry.param] = params[entry.param]
      ? `${params[entry.param]},${entry.value}`
      : entry.value;
  });
  return params;
}

function SupportList() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [draftFilters, setDraftFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const sortValue = SORT_VALUE_MAP[selectedSort];
  const filterParams = useMemo(() => buildFilterParams(appliedFilters), [appliedFilters]);

  const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [loadMoreError, setLoadMoreError] = useState(null);

  // 정렬이 빠르게 바뀌는 등으로 요청이 겹칠 때, 먼저 시작했지만 늦게 도착한 응답이
  // 나중 요청 결과를 덮어쓰지 않도록 매 호출마다 증가시켜 최신 요청만 반영함
  const requestIdRef = useRef(0);

  const loadPolicies = useCallback(async (targetPage, sort, filters) => {
    const isFirstPage = targetPage === 0;
    const requestId = (requestIdRef.current += 1);

    if (isFirstPage) {
      setLoading(true);
      setError(null);
      // 이전 더보기 요청이 진행 중이었다면 새 첫 페이지 요청으로 무효화되므로 같이 초기화함
      setLoadingMore(false);
      setLoadMoreError(null);
    } else {
      setLoadingMore(true);
      setLoadMoreError(null);
    }

    try {
      const data = await getPolicies({ page: targetPage, size: PAGE_SIZE, sort, ...filters });
      if (requestIdRef.current !== requestId) return; // 그 사이 더 최신 요청이 시작됐으면 무시
      setPolicies((prev) => (isFirstPage ? data.content : [...prev, ...data.content]));
      setPage(data.page);
      setHasNext(data.hasNext);
      setTotalElements(data.totalElements);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      if (isFirstPage) setError('정책 목록을 불러오지 못했어요');
      else setLoadMoreError('추가 목록을 불러오지 못했어요');
    } finally {
      if (requestIdRef.current !== requestId) return;
      if (isFirstPage) setLoading(false);
      else setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPolicies(0, sortValue, filterParams);
  }, [loadPolicies, sortValue, filterParams]);

  const openFilterSheet = () => {
    setDraftFilters(appliedFilters);
    setFilterOpen(true);
  };

  const toggleDraftFilter = (option) => {
    setDraftFilters((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
    );
  };

  const removeAppliedFilter = (option) => {
    setAppliedFilters((prev) => prev.filter((item) => item !== option));
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setFilterOpen(false);
  };

  return (
    <div className="support-page">
      <header className="support-header">
        <button
          type="button"
          className="support-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>제도 한눈에보기</h1>
      </header>

      <div className="support-body">
        <div className="support-toolbar">
          <div className="support-count">{totalElements}개의 정책</div>
          <div className="support-toolbar-actions">
            <DropdownTrigger label="필터" onClick={openFilterSheet} />
            <DropdownTrigger label={selectedSort} onClick={() => setSortOpen(true)} />
          </div>
        </div>

        {appliedFilters.length > 0 && (
          <div className="support-filter-chips">
            {appliedFilters.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                selected
                onClick={() => removeAppliedFilter(filter)}
              />
            ))}
          </div>
        )}

        {loading && (
          <div className="support-loading">
            <LoadingSpinner />
          </div>
        )}

        {!loading && error && (
          <ErrorState message={error} onRetry={() => loadPolicies(0, sortValue, filterParams)} />
        )}

        {!loading && !error && policies.length === 0 && (
          <p className="support-empty">아직 등록된 정책이 없어요</p>
        )}

        {!loading && !error && policies.length > 0 && (
          <>
            <ul className="support-list">
              {policies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  level={toPolicyLevel(policy.matchLevel)}
                  dday={formatDday(policy.applicationEnd)}
                  title={policy.title}
                  description={policy.matchReason}
                  onClick={() => navigate(`/support/${policy.id}`)}
                />
              ))}
            </ul>

            {hasNext && !loadMoreError && (
              <Button
                variant="gray"
                fullWidth
                className="support-load-more"
                disabled={loadingMore}
                onClick={() => loadPolicies(page + 1, sortValue, filterParams)}
              >
                {loadingMore ? '불러오는 중' : '더보기'}
              </Button>
            )}

            {loadMoreError && (
              <ErrorState
                message={loadMoreError}
                retryLabel="다시 시도"
                onRetry={() => loadPolicies(page + 1, sortValue, filterParams)}
              />
            )}
          </>
        )}
      </div>

      <ChatbotButton onClick={() => navigate('/chatbot')} />

      <BottomSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        footer={
          <div className="filter-sheet-footer">
            <Button variant="gray" className="filter-reset-btn" onClick={() => setDraftFilters([])}>
              초기화
            </Button>
            <Button variant="blue" fullWidth className="filter-apply-btn" onClick={applyFilters}>
              적용하기
            </Button>
          </div>
        }
      >
        {FILTER_GROUPS.map((group) => (
          <div className="filter-sheet-group" key={group.title}>
            <p className="filter-sheet-group-title">{group.title}</p>
            <div className="filter-sheet-group-options">
              {group.options.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={draftFilters.includes(option)}
                  onClick={() => toggleDraftFilter(option)}
                />
              ))}
            </div>
          </div>
        ))}
      </BottomSheet>

      <BottomSheet open={sortOpen} onClose={() => setSortOpen(false)}>
        <SortMenu
          open={sortOpen}
          value={selectedSort}
          options={SORT_OPTIONS}
          onSelect={(option) => {
            setSelectedSort(option);
            setSortOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
}

export default SupportList;
