import React from "react";
import styled from "styled-components";

interface SetInfoModalProps {
  setInfo: {
    set_id: string;
    weight: number;
    distance: number;
    repetitions: number;
    exercise_id: number;
  }[]; // 세트 정보 객체 배열
  onClose: () => void;
  modalInfo: boolean;
}

const SetInfoModal = ({ setInfo, onClose, modalInfo }: SetInfoModalProps): JSX.Element => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>세트 정보</h3>
        {modalInfo ? (
          setInfo.map((set, index) => (
            <SetInfoWrapper key={set.set_id}>
              <InfoText>세트 : {index + 1}</InfoText>
              <InfoText>{set.weight !== 0 ? `무게 : ${set.weight} kg`
                : null
              }</InfoText>
              <InfoText>{set.repetitions !== 0 ? `횟수 : ${set.repetitions} 회`
                : null
              }</InfoText>
              <InfoText>{set.distance !== 0 ? `거리 : ${set.distance} km`
                : null
              }</InfoText>

            </SetInfoWrapper>
          ))
        ) : (
          <InfoText>세트 정보가 없습니다</InfoText>
        )}
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};


export default SetInfoModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out forwards;

  h3 {
    margin: 0 0 16px;
    font-size: 1.5rem;
    color: #333;
    text-align: center;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SetInfoWrapper = styled.div`
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
`;

const SetTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 1.2rem;
  color: #555;
`;

const InfoText = styled.p`
  margin: 4px 0;
  font-size: 1rem;
  color: #666;
`;

const CloseButton = styled.button`
  margin-top: 16px;
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }
`;