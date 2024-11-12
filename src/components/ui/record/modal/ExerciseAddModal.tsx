import React, { useState } from "react";
import styled from "styled-components";
import api from "../../../../services/api/axios"
import { useAuth } from "context/AuthContext";

interface ExerciseAddModalProps {
  searchTerm: string;
  onClose: () => void;
  receiveInsertExer: (newExercise: any) => void;
}

const ExerciseAddModal = ({ searchTerm, onClose, receiveInsertExer }: ExerciseAddModalProps): JSX.Element => {
  
  const { state } = useAuth();
  const token = state.token;
  const memberId = state.memberId;
  
  const [exerciseType, setExerciseType] = useState(searchTerm);
  const [duration, setDuration] = useState<number>(0);
  const [intensity, setIntensity] = useState<string>("");

  const [newExercise,setNewExercise] = useState({});  

  // 운동 추가
  const exerciseInsert = async () => {
    try {
      const data = {
        'exercise_type': exerciseType,
        'intensity': intensity,
        'duration': duration,
        'member_id': memberId
      }

      const response = await api.post("record/exercise/insert/type", data,
        { headers: { Authorization: `Bearer ${token}` } });
      
      console.log("debug >>> exer Insert : ", response.data);
      
      setNewExercise(response.data);

    } catch (error) {
      console.error("debug >>> error", error);
    }
  };

  const handleSave = (exer:{}) => {
    receiveInsertExer(exer); // 부모 컴포넌트에 새 운동 추가
    onClose(); // 모달 닫기
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>새로운 운동 추가</h3>
        <Label>
          운동 이름:
          <input type="text" value={exerciseType} onChange={(e) => setExerciseType(e.target.value)} />
        </Label>
        <Label>
          운동 시간 (분):
          <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
        </Label>
        <Label>
          운동 강도:
          <input type="text" value={intensity} onChange={(e) => setIntensity(e.target.value)} />
        </Label>
        <ButtonContainer>
          <SaveButton onClick={handleSave}>저장</SaveButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ExerciseAddModal;

// 스타일 정의
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
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;

  input {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const SaveButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;