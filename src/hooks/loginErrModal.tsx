import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  width: 70%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalBody = styled.div`
  overflow-y: auto;
  max-height: 70vh;
  padding-right: 10px;
  text-align: center;
  margin-bottom: 30px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const LoginButton = styled(Link)`
  background-color: #000000;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;

  position: absolute;
  bottom: 20px;
  right: 20px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #333333; /* 호버 시 색상 변경 */
  }
`;

interface LoginErrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginErrModal: React.FC<LoginErrModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalBody>
          <h2>⚠️ 로그인 필요</h2>
          <p>
            안녕하세요. 워크스페이스입니다. <br /> <br />
            우리는 사용자 맞춤형 소셜 피트니스 플랫폼으로서 사용자에 맞는
            최적화된 정보제공을 위해 로그인을 필수로 하고 있습니다. <br />
            <br />
            원활한 서비스 이용을 위해 회원가입 및 로그인을 진행해주세요. <br />
            감사합니다.
          </p>
        </ModalBody>
        <CloseButton onClick={onClose}>×</CloseButton>
        <LoginButton to="/loginpage" onClick={onClose}>
          Login
        </LoginButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginErrModal;
