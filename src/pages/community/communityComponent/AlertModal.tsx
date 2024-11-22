import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalMessage = styled.p`
  margin-bottom: 20px;
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background-color:  #b6c0d3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #303d55
  }
`;

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalMessage>{message}</ModalMessage>
        <CloseButton onClick={onClose}>확인</CloseButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AlertModal;
