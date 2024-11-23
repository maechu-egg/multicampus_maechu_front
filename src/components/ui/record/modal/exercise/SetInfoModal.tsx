import React, { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import styled from "styled-components";
import api from "../../../../../services/api/axios";

interface SetInfo {
  set_id: number;
  weight: number;
  distance: number;
  repetitions: number;
  exercise_id: number;
}

interface SetInfoModalProps {
  setInfo: SetInfo[];
  onClose: () => void;
  modalInfo: boolean;
  receiveUpdatedSet: (updatedSet: SetInfo) => void;
  receiveDeletedSet: (deletedSet: number) => void;
}

const SetInfoModal = ({ setInfo, onClose, modalInfo, receiveUpdatedSet, receiveDeletedSet }: SetInfoModalProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;

  const [editingSetId, setEditingSetId] = useState<number | null>(null);
  const [editData, setEditData] = useState<SetInfo>({} as SetInfo);

  const [weight, setWeight] = useState<number | undefined>(editData.weight);
  const [distance, setDistance] = useState<number | undefined>(editData.distance);
  const [repetitions, setRepetitions] = useState<number | undefined>(editData.repetitions);

  const openEditModal = (currentData: SetInfo) => {
    setEditingSetId(currentData.set_id);
    setEditData(currentData);
  };

  const handleSave = async () => {
    if (editingSetId !== null) {
      if ((weight != null && distance != null && repetitions != null)
        && !(weight === 0 && distance === 0  && repetitions === 0)) {

        editData.distance = distance;
        editData.repetitions = repetitions;
        editData.weight = weight;
        
        await updateSetInfo(editData);
        setEditingSetId(null); // 저장 후 수정 모드 해제
        
      } else{
        alert("값은 한 개 이상 넣어야 합니다.");
      }
    }
  };

  const updateSetInfo = async (setInfo: SetInfo) => {
    try {
      const response = await api.put(
        "record/exercise/update/set",
        {
          set_id: setInfo.set_id,
          weight: setInfo.weight,
          distance: setInfo.distance,
          repetitions: setInfo.repetitions,
          exercise_id: setInfo.exercise_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("debug >>> update Set :", response.data);
      receiveUpdatedSet(editData); // 수정된 세트 데이터 전달
    } catch (error) {
      console.log("debug >>> error:", error);
    }
  };

  const deleteSetInfo = async (setId: number) => {
    console.log("debug >>> delete setId : ", setId);
    try {
      const response = await api.delete('record/exercise/delete/set', {
        headers: { Authorization: `Bearer ${token}` },
        params: { set_id: setId }
      });
      console.log("debug >>> delete Set : ", response.data);
      receiveDeletedSet(setId);
    } catch (error) {
        console.log("Error deleting set:", error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>세트 정보</h3>
        {modalInfo ? (
          setInfo.map((set, index) => (
            <SetInfoWrapper key={set.set_id}>
              <IndexContainer>
                <InfoText>세트 {index + 1}</InfoText>
                {editingSetId === set.set_id ? (
                  <>
                    <Label>
                      무게: 
                      <input type="number" value={weight} 
                        onChange={(e) => setWeight(parseInt(e.target.value))}
                        placeholder="무게는 선택사항입니다"
                      />
                    </Label>
                    <Label>
                      횟수: 
                      <input type="number" value={repetitions} 
                        onChange={(e) => setRepetitions(parseInt(e.target.value))} 
                        placeholder="횟수는 선택사항입니다"
                      />
                    </Label>
                    <Label>
                      거리: 
                      <input type="number" value={distance} 
                        onChange={(e) => setDistance(parseInt(e.target.value))} 
                        placeholder="거리는 선택사항입니다"
                      /> 
                    </Label>
                    <SaveButton onClick={handleSave}>저장</SaveButton>
                  </>
                ) : (
                  <>
                    {set.weight !== 0 && <InfoText>무게: {set.weight} kg</InfoText>}
                    {set.repetitions !== 0 && <InfoText>횟수: {set.repetitions} 회</InfoText>}
                    {set.distance !== 0 && <InfoText>거리: {set.distance} km</InfoText>}
                  </>
                )}
              </IndexContainer>
              <ControlButtonContainer>
                <ControlButton onClick={() => openEditModal(set)}>✎</ControlButton>
                <ControlButton onClick={() => deleteSetInfo(set.set_id)}>✕</ControlButton>
              </ControlButtonContainer>
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
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out forwards;
  text-align: center;

  h3 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 16px;
    font-weight: 600;
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
  background: #f1f3f5;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const IndexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #444;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: bold;
  font-size: 14px;
  color: #555555;

  input {
    padding: 8px;
    font-size: 14px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ControlButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  background-color: #1D2636;
  color: #ffffff;
  border: none;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #333C4D;
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(29, 38, 54, 0.4);
  }
`;

const SaveButton = styled.button`
  margin-top: 8px;
  padding: 6px 12px;
  background: #1D2636;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background: #333C4D;
  }
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 16px;
  background: #1D2636;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #333C4D;
  }
`;