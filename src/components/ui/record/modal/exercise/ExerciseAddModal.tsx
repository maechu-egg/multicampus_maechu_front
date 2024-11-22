import React, { useState } from "react";
import styled from "styled-components";
import api from "../../../../../services/api/axios"
import { useAuth } from "context/AuthContext";
import SetAddModal from "./SetAddModal";

interface SetInfo {
  weight: number;
  distance: number;
  repetitions: number;
  exercise_id : number;
}

interface ExerciseAddModalProps {
  searchTerm: string;
  onClose: () => void;
  successExerInsert: (successBoolean: boolean) => void;
}

// 운동 추가 모달 컴포넌트
const ExerciseAddModal = ({ searchTerm, onClose, successExerInsert }: ExerciseAddModalProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;

  const [duration, setDuration] = useState<number | null>(null);
  const [intensity, setIntensity] = useState<string>("");
  const [exerciseId, setExerciseId] = useState<number>(0);
  const [sets, setSets] = useState<SetInfo[]>([]); // 세트 정보를 저장하는 상태
  const [isSetModalOpen, setIsSetModalOpen] = useState(false); // 세트 추가 모달 상태

  // 운동 추가 함수
  const exerciseInsert = async () => {
    try {
      const response = await api.post("record/exercise/insert/type", {
        exercise_type: searchTerm,
        intensity: intensity,
        duration: duration,
        member_id: state.memberId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("debug >>> exercise Insert : ", response.data);
      setExerciseId(response.data); // 운동 ID 설정
      return response.data;
    } catch (error) {
      console.error("debug >>> error", error);
      return null;
    }
  };

  // 세트 추가 함수
  const setInsert = async (exerciseId: number) => {
    if (sets.length === 0) {
      console.log("debug >>> No sets to insert");
      return true;
    }

    try {
      const setsWithExerciseId = sets.map(set => ({
        ...set,
        exercise_id: exerciseId,
      }));
      console.log("debug >>> setsWithExerciseId : ", setsWithExerciseId);
      const response = await api.post(
        "record/exercise/insert/set",
        setsWithExerciseId,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("debug >>> set Insert : ", response.data);
      return response.data;
    } catch (error) {
      console.error("debug >>> error : " + error);
      return false;
    }
  };
 // 저장 버튼 클릭 시
  const handleSave = async () => {
    if(intensity && duration){
      const exerciseResponse = await exerciseInsert();
      console.log("debug >>> exerciseResponse : ", exerciseResponse);
      if (exerciseResponse) {
        const isSuccess = await setInsert(exerciseResponse); // 운동 추가 후 세트 추가
        console.log("debug >>> isSuccess : ", isSuccess);
        successExerInsert(isSuccess);
      } else {
        successExerInsert(false);
      }
      onClose(); // 모달 닫기
    } else{

      alert("양식에 맞춰 입력해주세요");

    }
  };

  // 세트 추가 모달에서 받은 세트 정보를 저장
  const handleSetSave = (newSet: SetInfo) => {
    setSets((prevSets) => [...prevSets, newSet]);
  };

  // 세트 추가 모달 열기
  const openSetModal = () => {
    setIsSetModalOpen(true);
  };

  // 세트 추가 모달 닫기
  const closeSetModal = () => {
    setIsSetModalOpen(false);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>새로운 운동 추가</h3>
        <Label>
          운동:
          <input type="text" value={searchTerm} readOnly/>
        </Label>
        <Label>
          시간 (분):
          <input type="number"
            value={duration !== null ? duration : undefined}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            placeholder="시간을 입력해주세요"
          />
        </Label>
        <Label>
          강도:
          <select value={intensity !== "" ? intensity : ""} onChange={(e) => setIntensity(e.target.value)}>
            <option value="" disabled selected hidden>강도를 선택하세요</option>
            <option value="HIGH">상</option>
            <option value="GENERAL">중</option>
            <option value="LOW">하</option>
          </select>
        </Label>

        <h4> </h4>
        {sets.map((set, index) => (
          <div key={index}>
            <p>무게: {set.weight} kg, 거리: {set.distance} m, 반복: {set.repetitions}회</p>
          </div>
        ))}
        <AddSetButton onClick={openSetModal}>세트 추가</AddSetButton>

        <ButtonContainer>
          <SaveButton onClick={handleSave}>저장</SaveButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonContainer>

        {isSetModalOpen && (
          <SetAddModal
            exercise_id={exerciseId}  // exerciseId가 있을 때만 전달, 없으면 0으로 기본값 설정
            onClose={closeSetModal}
            onSave={handleSetSave}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ExerciseAddModal;

// 스타일 정의

const AddSetButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  background-color: #1D2636;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffffff;
    color: #1D2636;
  }
`;

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
  width: 450px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: left;
  color: #1D2636;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 14px;
  color: #555555;

  input, select {
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
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  background-color: #1D2636;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffffff;
    color: #1D2636;
  }
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  background-color: #1D2636;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffffff;
    color: #1D2636;
  }
`;