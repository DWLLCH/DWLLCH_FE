import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import Button from '../components/Button';
import useMyInfo from '../hooks/useMyInfo';
import { formatBirthDate, formatDateDots } from '../utils/formatters';
import '../styles/MyInfo.css';

function MyInfoView() {
  const navigate = useNavigate();
  const { data } = useMyInfo();
  const {
    birthDate,
    sido,
    sigungu,
    protectionType,
    endStatus,
    endDate,
    housing,
    housingSituation,
    lifestyle,
    incomeType,
    currentSupports,
    supportNeeds,
  } = data;

  const endDateLabel = endStatus === '보호 종료했어요' ? '보호 종료일' : '보호 종료 예정일';

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
        <h1>내 정보 확인하기</h1>
      </header>

      <div className="myinfo-body">
        <section className="myinfo-card">
          <h2 className="myinfo-card-title">기본 정보</h2>
          <div className="myinfo-row">
            <span className="myinfo-row-label">생년월일</span>
            <span className="myinfo-row-value">{formatBirthDate(birthDate)}</span>
          </div>
          <div className="myinfo-row">
            <span className="myinfo-row-label">거주지역</span>
            <span className="myinfo-row-value">
              {sido} {sigungu}
            </span>
          </div>
          <div className="myinfo-row">
            <span className="myinfo-row-label">보호 이력</span>
            <span className="myinfo-row-value">{protectionType}</span>
          </div>
          <div className="myinfo-row">
            <span className="myinfo-row-label">현재 보호종료 상태</span>
            <span className="myinfo-row-value">{endStatus}</span>
          </div>
          {endDate && (
            <div className="myinfo-row">
              <span className="myinfo-row-label">{endDateLabel}</span>
              <span className="myinfo-row-value">{formatDateDots(endDate)}</span>
            </div>
          )}
        </section>

        <section className="myinfo-card">
          <h2 className="myinfo-card-title">주거</h2>
          <div className="myinfo-row">
            <span className="myinfo-row-label">주거 형태</span>
            <span className="myinfo-row-value">{housing}</span>
          </div>
          <div className="myinfo-row">
            <span className="myinfo-row-label">주거 관련 상황</span>
            <span className="myinfo-row-value">{housingSituation}</span>
          </div>
        </section>

        <section className="myinfo-card">
          <h2 className="myinfo-card-title">생활·소득</h2>
          <div className="myinfo-row">
            <span className="myinfo-row-label">현재 생활</span>
            <span className="myinfo-row-value">{lifestyle.join(', ')}</span>
          </div>
          <div className="myinfo-row">
            <span className="myinfo-row-label">현재 소득 형태</span>
            <span className="myinfo-row-value">{incomeType}</span>
          </div>
        </section>

        <section className="myinfo-card">
          <h2 className="myinfo-card-title">지원 현황</h2>
          <div className="myinfo-row">
            <span className="myinfo-row-label">현재 받고 있는 지원</span>
            <span className="myinfo-row-value">{currentSupports.join(', ')}</span>
          </div>
          <div className="myinfo-row">
            <span className="myinfo-row-label">지금 가장 필요한 도움</span>
            <span className="myinfo-row-value">{supportNeeds.join(', ')}</span>
          </div>
        </section>

        <Button variant="green" fullWidth onClick={() => navigate('/my-info/edit')}>
          내 정보 수정하기
        </Button>
      </div>
    </div>
  );
}

export default MyInfoView;
