import React, { useState } from "react";
import styled from "styled-components";

interface SetInfo {
  weight: number;
  distance: number;
  repetitions: number;
  exercise_id: number;
}

interface SetAddModalProps {
    exercise_id: number; // exercise_id 추가
    onClose: () => void;
    onSave: (setInfo: SetInfo) => void;
  }
  

  const SetAddModal = ({ exercise_id, onClose, onSave }: SetAddModalProps): JSX.Element => {
    const [weight, setWeight] = useState<number>(0);
    const [distance, setDistance] = useState<number>(0);
    const [repetitions, setRepetitions] = useState<number>(0);
  
    const handleSave = () => {
      onSave({ weight, distance, repetitions, exercise_id }); // exercise_id 포함
      onClose();
    };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>세트 추가</h3>
        <Label>
          무게 (kg):
          <input type="number" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} />
        </Label>
        <Label>
          거리 (m):
          <input type="number" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} />
        </Label>
        <Label>
          반복 횟수:
          <input type="number" value={repetitions} onChange={(e) => setRepetitions(parseInt(e.target.value))} />
        </Label>
        <ButtonContainer>
          <SaveButton onClick={handleSave}>저장</SaveButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
export default SetAddModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 400px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const Title = styled.h3`
  margin-bottom: 20px;
  font-size: 20px;
  color: #333333;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 14px;
  color: #555555;

  input {
    margin-top: 8px;
    padding: 8px;
    font-size: 14px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: #f44336;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;