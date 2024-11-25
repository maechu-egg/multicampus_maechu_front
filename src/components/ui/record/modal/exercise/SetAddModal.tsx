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
    const [weightValue, setWeightValue] = useState<number | undefined>(undefined);
    const [distanceValue, setDistanceValue] = useState<number | undefined>(undefined);
    const [repetitionsValue, setRepetitionsValue] = useState<number | undefined>(undefined);
  
    const handleSave = () => {

      const weight = weightValue != null ? weightValue : 0;
      const distance = distanceValue != null ? distanceValue : 0;
      const repetitions = repetitionsValue != null ? repetitionsValue : 0;
      if(weight !== 0 || distance !== 0 || repetitions !==0){
        onSave({ weight, distance, repetitions, exercise_id });
        onClose();
      } else{
        alert("값은 한 개 이상 넣어야 합니다.");
      }  
    };
  
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <h3>세트 추가</h3>
          <Label>
            무게 (kg):
            <input
              type="number"
              value={weightValue}
              onChange={(e) => setWeightValue(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="무게는 선택사항입니다."
            />
          </Label>
          <Label>
            거리 (km):
            <input
              type="number"
              step="0.01"  // 소수점 단위로 입력 가능하도록 설정
              value={distanceValue}
              onChange={(e) => setDistanceValue(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="거리는 선택사항입니다."            />
          </Label>
          <Label>
            반복 횟수:
            <input
              type="number"
              value={repetitionsValue}
              onChange={(e) => setRepetitionsValue(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="횟수는 선택사항입니다."            />
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

  @media (max-width: 768px) {
    width: 340px;
    padding: 18px;
  }

  @media (max-width: 425px) {
    width: 300px;
    padding: 16px;
  }

  @media (max-width: 375px) {
    width: 270px;
    padding: 14px;
  }

  @media (max-width: 320px) {
    width: 240px;
    padding: 12px;
  }
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

    @media (max-width: 768px) {
      padding: 7px;
      font-size: 13px;
    }

    @media (max-width: 425px) {
      padding: 6px;
      font-size: 12px;
    }

    @media (max-width: 375px) {
      padding: 5px;
      font-size: 11px;
    }

    @media (max-width: 320px) {
      padding: 4px;
      font-size: 10px;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 18px;
  }

  @media (max-width: 425px) {
    margin-top: 16px;
  }

  @media (max-width: 375px) {
    margin-top: 14px;
  }

  @media (max-width: 320px) {
    margin-top: 12px;
  }
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: #1D2636;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #333C4D;
  }

  @media (max-width: 768px) {
    padding: 9px 18px;
    font-size: 13px;
  }

  @media (max-width: 425px) {
    padding: 8px 16px;
    font-size: 12px;
  }

  @media (max-width: 375px) {
    padding: 7px 14px;
    font-size: 11px;
  }

  @media (max-width: 320px) {
    padding: 6px 12px;
    font-size: 10px;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: #4A5568;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2D3748;
  }

  @media (max-width: 768px) {
    padding: 9px 18px;
    font-size: 13px;
  }

  @media (max-width: 425px) {
    padding: 8px 16px;
    font-size: 12px;
  }

  @media (max-width: 375px) {
    padding: 7px 14px;
    font-size: 11px;
  }

  @media (max-width: 320px) {
    padding: 6px 12px;
    font-size: 10px;
  }
`;