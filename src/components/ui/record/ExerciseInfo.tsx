import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import styled from "styled-components";
import api from "../../../services/api/axios";
import SetInfoModal from "./SetInfoModal";

interface ExerciseInfoProps {
  exercise: {
    exercise_type: string;
    duration: number;
    intensity: number;
    calories: number;
    exercise_id: number;
    met: number;
    record_date: string;
  };
}

const ExerciseInfo = ({ exercise }: ExerciseInfoProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;

  const [setInfo, setSetInfo] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showSetInfo = async () => {
    try {
      const response = await api.get("record/exercise/get/setInfo", {
        headers: { Authorization: `Bearer ${token}` },
        params: { exercise_id: exercise.exercise_id },
      });
      setSetInfo(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch set info:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ExercisePoint>
      <InfoText>운동명 : {exercise.exercise_type}</InfoText>
      <InfoText>
        시간 :{" "}
        {exercise.duration > 60
          ? `${Math.floor(exercise.duration / 60)} 시간 ${exercise.duration % 60} 분`
          : `${exercise.duration} 분`}
      </InfoText>
      <InfoText>강도 : {exercise.intensity}</InfoText>
      <InfoText>칼로리 : {exercise.calories} kcal</InfoText>
      <ActionButton onClick={showSetInfo}>세트</ActionButton>
      {isModalOpen && (
        <SetInfoModal
          setInfo={setInfo}
          onClose={closeModal}
          modalInfo={setInfo.length > 0}
        />
      )}
    </ExercisePoint>
  );
};
const ExercisePoint = styled.div`
  display: flex;
  justify-content: center;   
  flex-direction: column;
  padding: 16px;
  margin: 16px 0;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 12px;
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

const ActionButton = styled.button`
  margin-top: 12px;
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.4);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
`;

export default ExerciseInfo;