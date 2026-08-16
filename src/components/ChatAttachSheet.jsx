import { useRef } from 'react';
import imageIcon from '../assets/image.svg';
import fileIcon from '../assets/fileIcon.svg';
import BottomSheet from './BottomSheet';
import { MAX_ATTACH_COUNT } from '../constants/chatbot';
import '../styles/ChatAttachSheet.css';

function ChatAttachSheet({ open, onClose, onSelectImages, onSelectFiles }) {
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_ATTACH_COUNT);
    e.target.value = '';
    if (files.length === 0) return;
    onSelectImages(files);
    onClose();
  };

  const handleFilePick = (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_ATTACH_COUNT);
    e.target.value = '';
    if (files.length === 0) return;
    onSelectFiles(files);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <p className="chat-attach-title">사진·파일 첨부</p>
      <p className="chat-attach-subtitle">최대 {MAX_ATTACH_COUNT}개까지 한 번에 보낼 수 있어요</p>

      <button
        type="button"
        className="chat-attach-option"
        onClick={() => imageInputRef.current?.click()}
      >
        <span className="chat-attach-option-icon">
          <img src={imageIcon} alt="" />
        </span>
        사진 선택하기
      </button>

      <button
        type="button"
        className="chat-attach-option"
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="chat-attach-option-icon">
          <img src={fileIcon} alt="" className="chat-attach-option-icon--file" />
        </span>
        파일 선택하기
      </button>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="chat-attach-input"
        onChange={handleImagePick}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="chat-attach-input"
        onChange={handleFilePick}
      />
    </BottomSheet>
  );
}

export default ChatAttachSheet;
