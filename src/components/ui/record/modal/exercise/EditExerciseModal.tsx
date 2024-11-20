import React, { useState } from "react";
import styled from "styled-components";

interface EditExerciseModalProps {
    currentIntensity: string;
    onClose: () => void;
    onSave: (updateDuration: number, updatedIntensity: string) => void;
}

const EditExerciseModal = ({ onClose, onSave, currentIntensity }: EditExerciseModalProps): JSX.Element => {
    const [duration, setDuration] = useState<number | null>(null);
    const [intensity, setIntensity] = useState<string>("");

    const handleSave = () => {
      if(duration !== null)
        onSave(duration, intensity); // 부모 컴포넌트로 수정된 값 전달
        onClose();
    };

    return (
      <ModalOverlay>
        <ModalContent>
          <h3>운동 정보 수정</h3>
          <label>
            시간 (분):
            <input
              type="number"
              value={duration !== null ? duration : undefined}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              placeholder="시간을 입력해주세요"
            />
          </label>
          <label>
            강도:
            <select
              value={intensity !== null ? intensity : undefined}
              onChange={(e) => setIntensity(e.target.value)}
            >
              <option value="" disabled selected hidden>강도를 선택하세요</option>              
              <option value={"high"}>상</option>
              <option value={"general"}>중</option>
              <option value={"low"}>하</option>
            </select>
          </label>
          <ButtonContainer>
            <SaveButton onClick={handleSave}>저장</SaveButton>
            <CancelButton onClick={onClose}>취소</CancelButton>
          </ButtonContainer>
        </ModalContent>
      </ModalOverlay>
    );
};

export default EditExerciseModal;

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
  background: #fff;
  padding: 30px 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out forwards;
  text-align: center;

  h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 20px;
  }

  label {
    display: block;
    font-weight: bold;
    color: #666;
    margin-bottom: 12px;
    text-align: left;
  }

  input, select {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border 0.3s;

    &:focus {
      border-color: #007bff;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;


const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
  font-family: 'ONE-Mobile-Title'; // 폰트 설정
`;

const SaveButton = styled.button`
  padding: 12px 20px;
  background-color: #1D2636;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #333C4D;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.6);
  }
`;

const CancelButton = styled.button`
  padding: 12px 20px;
  background-color: #4A5568;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #2D3748;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(74, 85, 104, 0.6);
  }
`;
