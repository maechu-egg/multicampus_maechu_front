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
      <HeaderBar>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <HeaderIcon>🏃</HeaderIcon>
          <HeaderText>{exercise.exercise_type}</HeaderText>
        </div>
        <ControlButtonContainer>
          <ControlButton onClick={openExerModal}>+</ControlButton>
          <ControlButton onClick={deleteExerInfo}>-</ControlButton>
        </ControlButtonContainer>
      </HeaderBar>
      <InfoText>
        시간 :{" "}
        {exercise.duration > 60
          ? `${Math.floor(exercise.duration / 60)} 시간 ${exercise.duration % 60} 분`
          : `${exercise.duration} 분`}
      </InfoText>
      <InfoText>강도 : {exercise.intensity.toUpperCase()}</InfoText>
      <InfoText>칼로리 : {exercise.calories} kcal</InfoText>
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
  padding: 0;
  margin: 16px 0;
  border-radius: 12px;
  border: none;
  background-color: #fafafa;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  position: relative;
  width: 100%;

  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    margin: 12px 0;
  }

  @media (max-width: 425px) {
    margin: 10px 0;
  }

  @media (max-width: 375px) {
    margin: 8px 0;
  }

  @media (max-width: 320px) {
    margin: 6px 0;
  }
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #021D39;
  padding: 8px 16px;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 7px 14px;
  }

  @media (max-width: 425px) {
    padding: 6px 12px;
  }

  @media (max-width: 375px) {
    padding: 5px 10px;
  }

  @media (max-width: 320px) {
    padding: 4px 8px;
  }
`;

const InfoText = styled.p`
  margin: 8px 25px;
  color: #4a4a4a;
  font-family: 'ONE-Mobile-Title';
  font-size: 1rem;
  font-weight: 550;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 425px) {
    font-size: 0.85rem;
  }

  @media (max-width: 375px) {
    font-size: 0.8rem;
  }

  @media (max-width: 320px) {
    font-size: 0.75rem;
  }
`;

const ControlButtonContainer = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 7px;
  }

  @media (max-width: 425px) {
    gap: 6px;
  }

  @media (max-width: 375px) {
    gap: 5px;
  }

  @media (max-width: 320px) {
    gap: 4px;
  }
`;

const ControlButton = styled.button`
  padding: 4px 8px;
  background-color: #021D39;
  color: #fff;
  border: none;
  cursor: pointer;
  font-family: 'ONE-Mobile-Title';
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

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 425px) {
    font-size: 1.2rem;
  }

  @media (max-width: 375px) {
    font-size: 1.1rem;
  }

  @media (max-width: 320px) {
    font-size: 1rem;
  }
`;

const ActionButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 20px;
  margin-right: 20px;
  padding: 5px 16px;
  background-color: #1D2636;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'ONE-Mobile-Title';
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

  @media (max-width: 768px) {
    padding: 4px 14px;
    font-size: 0.85rem;
  }

  @media (max-width: 425px) {
    padding: 3px 12px;
    font-size: 0.8rem;
  }

  @media (max-width: 375px) {
    padding: 2px 10px;
    font-size: 0.75rem;
  }

  @media (max-width: 320px) {
    padding: 1px 8px;
    font-size: 0.7rem;
  }
`;

const HeaderIcon = styled.div`
  margin-right: 10px;
  font-size: 1.5rem;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 425px) {
    font-size: 1.3rem;
  }

  @media (max-width: 375px) {
    font-size: 1.2rem;
  }

  @media (max-width: 320px) {
    font-size: 1.1rem;
  }
`;

const HeaderText = styled.h2`
  color: #fff;
  font-family: 'ONE-Mobile-Title';
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 425px) {
    font-size: 1rem;
  }

  @media (max-width: 375px) {
    font-size: 0.95rem;
  }

  @media (max-width: 320px) {
    font-size: 0.9rem;
  }
`;
