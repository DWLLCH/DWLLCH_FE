import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backBtn from '../assets/backBtn.svg';
import logoImage from '../assets/logo_image.svg';
import SettingsRow from '../components/SettingsRow';
import Modal from '../components/Modal';
import BottomSheet from '../components/BottomSheet';
import Button from '../components/Button';
import { APP_VERSION, OPEN_SOURCE_LIBRARIES, SERVICE_INFO } from '../constants/mypage';
import '../styles/AccountChange.css';
import '../styles/Inquiry.css';
import '../styles/VersionInfo.css';

function VersionInfo() {
  const navigate = useNavigate();
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [serviceInfoOpen, setServiceInfoOpen] = useState(false);

  return (
    <div className="account-change-page">
      <header className="account-change-header">
        <button
          type="button"
          className="account-change-back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <img src={backBtn} alt="" />
        </button>
        <h1>버전 정보</h1>
      </header>

      <div className="inquiry-body">
        <div className="version-info-hero">
          <img src={logoImage} alt="" className="version-info-logo" />
          <p className="version-info-name">Fledge</p>
          <p className="version-info-desc">
            현재 버전 {APP_VERSION}
            <br />
            최신 버전을 사용 중이에요.
          </p>
        </div>

        <div className="inquiry-card">
          <SettingsRow
            label="오픈소스 라이선스"
            chevron
            onClick={() => setLicenseModalOpen(true)}
          />
          <SettingsRow label="서비스 정보" chevron onClick={() => setServiceInfoOpen(true)} />
        </div>
      </div>

      <Modal
        open={licenseModalOpen}
        onClose={() => setLicenseModalOpen(false)}
        title="오픈소스 라이선스"
      >
        <ul className="version-info-license-list">
          {OPEN_SOURCE_LIBRARIES.map((lib) => (
            <li key={lib.name}>
              <span className="version-info-license-name">{lib.name}</span>
              <span className="version-info-license-type">{lib.license}</span>
            </li>
          ))}
        </ul>
        <Button fullWidth onClick={() => setLicenseModalOpen(false)}>
          확인
        </Button>
      </Modal>

      <BottomSheet open={serviceInfoOpen} onClose={() => setServiceInfoOpen(false)}>
        <div className="service-info-sheet">
          <p className="service-info-name">{SERVICE_INFO.name}</p>
          <p className="service-info-tagline">{SERVICE_INFO.tagline}</p>
          <p className="service-info-desc">{SERVICE_INFO.description}</p>

          <div className="service-info-section">
            <p className="service-info-section-title">주요 기능</p>
            <ul className="service-info-feature-list">
              {SERVICE_INFO.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="service-info-section">
            <p className="service-info-section-title">현재 버전</p>
            <p className="service-info-version">{APP_VERSION}</p>
          </div>

          <div className="service-info-contact">
            <span className="service-info-contact-label">문의</span>
            <span className="service-info-contact-value">{SERVICE_INFO.contactEmail}</span>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export default VersionInfo;
