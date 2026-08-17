import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Dropdown from '../components/Dropdown';
import DatePicker from '../components/DatePicker';
import OptionChip from '../components/OptionChip';
import useMyInfo from '../hooks/useMyInfo';
import { updateMyProfile } from '../api/mypage';
import { SIDO_LIST, SIGUNGU_MAP } from '../constants/regions';
import { formatBirthDate, formatDateKey } from '../utils/formatters';
import {
  fromProtectionTypeLabel,
  fromHousingTypeLabel,
  fromHousingSituationLabel,
  fromLivingStatusLabels,
  fromIncomeTypeLabel,
  fromSupportReceivedLabels,
  fromNeededHelpLabels,
} from '../constants/profileLabels';
import '../styles/MyInfo.css';

const PROTECTION_TYPES = ['아동양육시설', '공동생활가정', '가정위탁', '기타', '잘 모르겠어요'];

const END_STATUSES = ['아직 보호 중이에요', '보호 종료했어요'];

const HOUSING_TYPES = [
  '월세 (보증금과 월 임대료를 내고 있어요)',
  '전세 (전세보증금을 내고 살아요)',
  '자가 (본인 소유의 집에서 살고 있어요)',
  '무상 거주 (가족이나 지인의 집에서 살고 있어요)',
  '시설·그룹홈 등',
];

const HOUSING_SITUATIONS = [
  '안정적으로 거주하고 있어요',
  '이사할 집을 찾고 있어요',
  '독립할 집을 찾고 있어요',
  '주거비가 부담스러워요',
  '곧 보호종료라 주거를 준비해야 해요',
  '아직 잘 모르겠어요',
];

const LIFESTYLES = [
  '학교에 다니고 있어요',
  '직장에 다니고 있어요',
  '아르바이트·파트타임으로 일하고 있어요',
  '프리랜서·플랫폼 노동을 하고 있어요',
  '자영업·창업을 하고 있어요',
  '취업을 준비하고 있어요',
  '현재 하고 있는 일이 없어요',
];

const INCOME_TYPES = [
  '근로소득 (직장, 아르바이트, 파트타임 등)',
  '사업소득 (프리랜서, 자영업, 플랫폼 노동 등)',
  '기타·재산소득 (이자, 임대소득 등)',
  '현재 소득이 없어요 (미취업, 취업준비 등)',
];

const GRID_SUPPORTS = [
  '자립정착금',
  '취업 지원',
  '자립수당',
  '생활비 지원',
  '주거지원',
  '금융 지원',
  '교육·장학 지원',
  '기타',
];

const EXTRA_SUPPORTS = ['잘 모르겠어요', '현재 받고 있는 지원이 없어요'];

const SUPPORT_NEEDS = [
  '주거 (집을 구하거나 주거비 지원이 필요해요)',
  '금융·생활비 (돈 관리나 생활비 지원이 필요해요)',
  '취업·진로 (일자리나 진로 정보가 필요해요)',
  '교육 (학업이나 교육비 지원이 필요해요)',
  '지원제도 (내가 받을 수 있는 지원을 찾고 싶어요)',
  '행정·서류 (신청이나 서류 준비가 어려워요)',
  '상담·도움 (누군가에게 상담을 받고 싶어요)',
];

const SUPPORT_NEEDS_MAX = 3;

function normalize(data) {
  return JSON.stringify({
    ...data,
    endDate: data.endDate ? formatDateKey(data.endDate) : null,
    lifestyle: [...data.lifestyle].sort(),
    currentSupports: [...data.currentSupports].sort(),
    supportNeeds: [...data.supportNeeds].sort(),
  });
}

function sameItems(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((item, index) => item === sortedB[index]);
}

function MyInfoEdit() {
  const navigate = useNavigate();
  const { data, refetch } = useMyInfo();
  const [draft, setDraft] = useState(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const patch = (fields) => setDraft((prev) => ({ ...prev, ...fields }));

  const handleBirthDateChange = (e) => {
    const input = e.target;
    const rawValue = input.value;
    const caret = input.selectionStart ?? rawValue.length;
    const strippedDigits = rawValue.replace(/\D/g, '').slice(0, 8);
    const prevDisplay = formatBirthDate(draft.birthDate);
    if (rawValue.length < prevDisplay.length && strippedDigits.length === draft.birthDate.length) {
      const digitsBeforeCaret = rawValue.slice(0, caret).replace(/\D/g, '').length;
      const removeIndex = Math.max(digitsBeforeCaret - 1, 0);
      patch({
        birthDate: draft.birthDate.slice(0, removeIndex) + draft.birthDate.slice(removeIndex + 1),
      });
    } else {
      patch({ birthDate: strippedDigits });
    }
  };

  const toggleInList = (field, item) => {
    const list = draft[field];
    patch({
      [field]: list.includes(item) ? list.filter((value) => value !== item) : [...list, item],
    });
  };

  const toggleSupportNeed = (item) => {
    const list = draft.supportNeeds;
    if (list.includes(item)) {
      patch({ supportNeeds: list.filter((value) => value !== item) });
    } else if (list.length < SUPPORT_NEEDS_MAX) {
      patch({ supportNeeds: [...list, item] });
    }
  };

  const toggleCurrentSupport = (item) => {
    const list = draft.currentSupports;
    if (list.includes(item)) {
      patch({ currentSupports: list.filter((value) => value !== item) });
      return;
    }
    if (EXTRA_SUPPORTS.includes(item)) {
      patch({ currentSupports: [item] });
    } else {
      patch({
        currentSupports: [...list.filter((value) => !EXTRA_SUPPORTS.includes(value)), item],
      });
    }
  };

  const sigunguOptions = draft.sido ? SIGUNGU_MAP[draft.sido] || [] : [];
  const hasValidResidence =
    SIDO_LIST.includes(draft.sido) && Boolean(SIGUNGU_MAP[draft.sido]?.includes(draft.sigungu));
  const endDateLabel = draft.endStatus === '보호 종료했어요' ? '보호 종료일' : '보호 종료 예정일';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDateMinDate = draft.endStatus === '아직 보호 중이에요' ? today : null;
  const endDateMaxDate = draft.endStatus === '보호 종료했어요' ? today : null;
  const endDateRangeError = !draft.endDate
    ? null
    : draft.endStatus === '아직 보호 중이에요' && draft.endDate < today
      ? '현재 일자보다 이전 날짜는 선택할 수 없어요'
      : draft.endStatus === '보호 종료했어요' && draft.endDate > today
        ? '현재 일자보다 이후 날짜는 선택할 수 없어요'
        : null;
  const hasRequiredEndDate = Boolean(draft.endDate) && !endDateRangeError;
  const isDirty = normalize(draft) !== normalize(data);
  const canSubmit = isDirty && hasValidResidence && hasRequiredEndDate && !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitError(null);
    setIsSubmitting(true);

    // 생년월일은 read_only라 payload에 넣지 않습니다.
    // 나머지 필드도 실제로 바뀐 것만 보냅니다. (안 바뀐 값까지 매번 같이 보내면,
    // 조회 이후 다른 경로로 바뀐 서버 값을 오래된 draft 값으로 덮어쓸 수 있어서)
    const payload = {};
    if (draft.sido !== data.sido || draft.sigungu !== data.sigungu) {
      payload.region = { sido: draft.sido, sigungu: draft.sigungu };
    }
    if (draft.protectionType !== data.protectionType) {
      payload.protectionType = fromProtectionTypeLabel(draft.protectionType);
    }
    const draftEndDateKey = draft.endDate ? formatDateKey(draft.endDate) : null;
    const dataEndDateKey = data.endDate ? formatDateKey(data.endDate) : null;
    if (draftEndDateKey !== dataEndDateKey) {
      // protectionEndDate는 현재 백엔드가 read_only라 무시되지만, writable로 바뀌는 즉시 바로 동작하도록 미리 보냅니다.
      payload.protectionEndDate = draftEndDateKey;
    }
    if (draft.housing !== data.housing) {
      payload.housingType = fromHousingTypeLabel(draft.housing);
    }
    if (draft.housingSituation !== data.housingSituation) {
      payload.housingSituation = fromHousingSituationLabel(draft.housingSituation);
    }
    if (!sameItems(draft.lifestyle, data.lifestyle)) {
      payload.livingStatus = fromLivingStatusLabels(draft.lifestyle);
    }
    if (draft.incomeType !== data.incomeType) {
      payload.incomeType = fromIncomeTypeLabel(draft.incomeType);
    }
    if (!sameItems(draft.currentSupports, data.currentSupports)) {
      payload.supportReceived = fromSupportReceivedLabels(draft.currentSupports);
    }
    if (!sameItems(draft.supportNeeds, data.supportNeeds)) {
      payload.neededHelp = fromNeededHelpLabels(draft.supportNeeds);
    }

    try {
      await updateMyProfile(payload);
      await refetch();
      navigate('/my-info');
    } catch {
      setSubmitError('정보를 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="myinfo-page">
      <header className="myinfo-header">
        <button
          type="button"
          className="myinfo-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>내 정보 수정하기</h1>
      </header>

      <form className="myinfo-body" onSubmit={handleSubmit}>
        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">생년월일</p>
          <TextField
            id="birthDate"
            name="birthDate"
            placeholder="ex. YYYY.MM.DD"
            value={formatBirthDate(draft.birthDate)}
            onChange={handleBirthDateChange}
            inputMode="numeric"
            maxLength={10}
            disabled
          />
        </section>

        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">거주지역</p>
          <Dropdown
            placeholder="시도 선택"
            value={draft.sido}
            options={SIDO_LIST}
            onChange={(value) => patch({ sido: value, sigungu: '' })}
          />
          <Dropdown
            className="myinfo-dropdown-gap"
            placeholder="시군구 선택"
            value={draft.sigungu}
            options={sigunguOptions}
            onChange={(value) => patch({ sigungu: value })}
            disabled={!draft.sido}
          />
        </section>

        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">보호 이력</p>
          <div className="myinfo-chip-grid">
            {PROTECTION_TYPES.map((type) => (
              <OptionChip
                key={type}
                label={type}
                selected={draft.protectionType === type}
                onClick={() => patch({ protectionType: type })}
              />
            ))}
          </div>
        </section>

        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">현재 보호종료 상태</p>
          <div className="myinfo-chip-grid">
            {END_STATUSES.map((status) => (
              <OptionChip
                key={status}
                label={status}
                selected={draft.endStatus === status}
                onClick={() => patch({ endStatus: status })}
              />
            ))}
          </div>
        </section>

        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">{endDateLabel}</p>
          <DatePicker
            value={draft.endDate}
            onChange={(date) => patch({ endDate: date })}
            minDate={endDateMinDate}
            maxDate={endDateMaxDate}
          />
          {endDateRangeError && <p className="myinfo-edit-error-inline">{endDateRangeError}</p>}
        </section>

        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">주거 형태</p>
          <div className="myinfo-option-list">
            {HOUSING_TYPES.map((type) => (
              <OptionChip
                key={type}
                label={type}
                fullWidth
                selected={draft.housing === type}
                onClick={() => patch({ housing: type })}
              />
            ))}
          </div>
        </section>

        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">주거 관련 상황</p>
          <div className="myinfo-option-list">
            {HOUSING_SITUATIONS.map((situation) => (
              <OptionChip
                key={situation}
                label={situation}
                fullWidth
                selected={draft.housingSituation === situation}
                onClick={() => patch({ housingSituation: situation })}
              />
            ))}
          </div>
        </section>

        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">현재 생활</p>
          <p className="myinfo-edit-helper">학교와 일을 병행하고 있다면 여러 개를 선택해주세요.</p>
          <div className="myinfo-option-list">
            {LIFESTYLES.map((item) => (
              <OptionChip
                key={item}
                label={item}
                fullWidth
                selected={draft.lifestyle.includes(item)}
                onClick={() => toggleInList('lifestyle', item)}
              />
            ))}
          </div>
        </section>

        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">현재 소득 형태</p>
          <div className="myinfo-option-list">
            {INCOME_TYPES.map((type) => (
              <OptionChip
                key={type}
                label={type}
                fullWidth
                selected={draft.incomeType === type}
                onClick={() => patch({ incomeType: type })}
              />
            ))}
          </div>
        </section>

        <section className="myinfo-edit-section">
          <p className="myinfo-edit-label">현재 받고 있는 지원</p>
          <p className="myinfo-edit-helper">있다면 모두 선택해주세요.</p>
          <div className="myinfo-chip-grid">
            {GRID_SUPPORTS.map((item) => (
              <OptionChip
                key={item}
                label={item}
                selected={draft.currentSupports.includes(item)}
                onClick={() => toggleCurrentSupport(item)}
              />
            ))}
          </div>
          <div className="myinfo-option-list">
            {EXTRA_SUPPORTS.map((item) => (
              <OptionChip
                key={item}
                label={item}
                fullWidth
                selected={draft.currentSupports.includes(item)}
                onClick={() => toggleCurrentSupport(item)}
              />
            ))}
          </div>
        </section>

        <section className="myinfo-edit-section myinfo-edit-section--last">
          <p className="myinfo-edit-label">지금 가장 필요한 도움</p>
          <p className="myinfo-edit-helper">최대 3개까지 선택해주세요.</p>
          <div className="myinfo-option-list">
            {SUPPORT_NEEDS.map((item) => {
              const selected = draft.supportNeeds.includes(item);
              return (
                <OptionChip
                  key={item}
                  label={item}
                  fullWidth
                  selected={selected}
                  disabled={!selected && draft.supportNeeds.length >= SUPPORT_NEEDS_MAX}
                  onClick={() => toggleSupportNeed(item)}
                />
              );
            })}
          </div>
        </section>

        {submitError && (
          <p className="myinfo-edit-error" role="alert">
            {submitError}
          </p>
        )}

        <Button type="submit" variant="green" fullWidth disabled={!canSubmit}>
          {isSubmitting ? '저장 중...' : '수정 완료'}
        </Button>
      </form>
    </div>
  );
}

export default MyInfoEdit;
