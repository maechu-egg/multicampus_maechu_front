import React, { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import styled from "styled-components";
import api from "../../../../../services/api/axios";
import SetInfoModal from "../../modal/exercise/SetInfoModal";
import EditExerciseModal from "../../modal/exercise/EditExerciseModal";
interface ExerciseInfoProps {
  exercise: {
    exercise_id: number;
    exercise_type: string;
    duration: number;
    intensity: string;
    calories: number;
    met: number;
    record_date: string;
    member_id: number;
  };
  receiveUpdatedExer: (updatedExercise: any) => void;
  receiveDeletedExer: (deletedExerciseId: number) => void;
}

interface SetInfo {
  set_id: number; 
  weight: number;
  distance: number;
  repetitions: number;
  exercise_id: number;
}

const ExerciseInfo = ({ exercise, receiveUpdatedExer, receiveDeletedExer }: ExerciseInfoProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;

  const [setInfo, setSetInfo] = useState<SetInfo[]>([]);
  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const showSetInfo = async () => {
    try {
      const response = await api.get("record/exercise/get/setInfo", {
        headers: { Authorization: `Bearer ${token}` },
        params: { exercise_id: exercise.exercise_id },
      });
      
      if (JSON.stringify(response.data) !== JSON.stringify(setInfo)) {
        setSetInfo(response.data);
      }
      
      setIsSetModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch set info:", error);
    }
  };

  const closeSetModal = () => {
    setIsSetModalOpen(false);
  };

  const closeExerModal = () => {
    setIsEditModalOpen(false);
  };

  const openExerModal = () => {
    setIsEditModalOpen(true);
  }

  const setSave = (updatedSet: SetInfo) => {   
      setSetInfo((prevSetInfo) =>
        prevSetInfo.map((set) =>
          set.set_id === updatedSet.set_id ? updatedSet : set
        )
      );
  };

  const setDelete = (deletedId: number) => {   
    setSetInfo((prevSetInfo) =>
      prevSetInfo.filter((set) => set.set_id !== deletedId)
    );
  };

  const updateExerInfo = async (duration: number, intensity: string) => {
    try {
      const response = await api.put("record/exercise/update/exer", {
        exercise_id: exercise.exercise_id,
        duration,
        intensity,
      }, { headers: { Authorization: `Bearer ${token}` } } );
    
      receiveUpdatedExer(response.data); // ExercisePage로 업데이트 전달

      closeExerModal();
    } catch (error) {
      console.log("debug >>> error : " + error);
    }
  };

  const deleteExerInfo = async () => {
    try{
      const response = await api.delete("record/exercise/delete/exer",{
        headers: { Authorization: `Bearer ${token}` },
        params : { exercise_id : exercise.exercise_id }
      });

      console.log("debug >>> delete row : " + response.data);
      receiveDeletedExer(exercise.exercise_id);
    } catch(error) {
      console.log("debug >>> error : " + error );
    }
  }


  return (
    <ExercisePoint>
      <InfoText>운동명 : {exercise.exercise_type}</InfoText>
      <InfoText>
        시간 :{" "}
        {exercise.duration > 60
          ? `${Math.floor(exercise.duration / 60)} 시간 ${exercise.duration % 60} 분`
          : `${exercise.duration} 분`}
      </InfoText>
      <InfoText>강도 : {exercise.intensity.toUpperCase()}</InfoText>
      <InfoText>칼로리 : {exercise.calories} kcal</InfoText>
      <ControlButtonContainer>
        <ControlButton onClick={openExerModal}>+</ControlButton>
        <ControlButton onClick={deleteExerInfo}>-</ControlButton>
      </ControlButtonContainer>
      <ActionButton onClick={showSetInfo}>세트</ActionButton>
      {isSetModalOpen && (
        <SetInfoModal
          setInfo={setInfo}
          onClose={closeSetModal}
          modalInfo={setInfo.length > 0}
          receiveUpdatedSet={setSave}
          receiveDeletedSet={setDelete}
        />
      )}
      {isEditModalOpen && (
        <EditExerciseModal
          currentIntensity={exercise.intensity}
          onClose={closeExerModal}
          onSave={updateExerInfo}
        />
      )}      
    </ExercisePoint>
  );
};

export default ExerciseInfo;




const ExercisePoint = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 16px 16px;
  margin: 16px 0;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  position: relative;

  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 28px 12px 12px;
    margin: 8px 0;
  }
`;

const InfoText = styled.p`
  margin: 8px 0;
  color: #4a4a4a;
  font-size: 1rem;
  font-weight: 550;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ControlButtonContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
`;

const ControlButton = styled.button`
  padding: 4px 8px;
  background-color: #fafafa;
  color: #4A5568;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0 7px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.3);
  }

  &:focus { 
    box-shadow: 0 0 0 3px #4A5568;
  }
`;

const ActionButton = styled.button`
  margin-top: 12px;
  padding: 5px 16px;
  background-color: #1D2636;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  align-self: left;
  transition: background 0.3s ease;

  &:hover {
    background-color: #333C4D;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.4);
  }
`;

