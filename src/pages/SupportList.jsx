import { useCallback, useEffect, useState } from 'react';
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
import { formatDday } from '../utils/formatters';
import { FILTER_GROUPS, SORT_OPTIONS } from '../constants/filterOptions';
import '../styles/SupportList.css';

const PAGE_SIZE = 20;

function SupportList() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [draftFilters, setDraftFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);

  const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [loadMoreError, setLoadMoreError] = useState(null);

  const loadPolicies = useCallback(async (targetPage) => {
    const isFirstPage = targetPage === 0;
    if (isFirstPage) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
      setLoadMoreError(null);
    }

    try {
      const data = await getPolicies({ page: targetPage, size: PAGE_SIZE });
      setPolicies((prev) => (isFirstPage ? data.content : [...prev, ...data.content]));
      setPage(data.page);
      setHasNext(data.hasNext);
      setTotalElements(data.totalElements);
    } catch (err) {
      if (isFirstPage) setError('정책 목록을 불러오지 못했어요');
      else setLoadMoreError('추가 목록을 불러오지 못했어요');
    } finally {
      if (isFirstPage) setLoading(false);
      else setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPolicies(0);
  }, [loadPolicies]);

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

        {!loading && error && <ErrorState message={error} onRetry={() => loadPolicies(0)} />}

        {!loading && !error && policies.length === 0 && (
          <p className="support-empty">아직 등록된 정책이 없어요</p>
        )}

        {!loading && !error && policies.length > 0 && (
          <>
            <ul className="support-list">
              {policies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  dday={formatDday(policy.applicationEnd)}
                  title={policy.title}
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
                onClick={() => loadPolicies(page + 1)}
              >
                {loadingMore ? '불러오는 중' : '더보기'}
              </Button>
            )}

            {loadMoreError && (
              <ErrorState
                message={loadMoreError}
                retryLabel="다시 시도"
                onRetry={() => loadPolicies(page + 1)}
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
