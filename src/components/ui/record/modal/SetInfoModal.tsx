import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import styled from "styled-components";
import api from "../../../../services/api/axios";

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
}

const SetInfoModal = ({ setInfo, onClose, modalInfo, receiveUpdatedSet }: SetInfoModalProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;

  const [editingSetId, setEditingSetId] = useState<number | null>(null);
  const [editData, setEditData] = useState<SetInfo>({} as SetInfo);

  const openEditModal = (currentData: SetInfo) => {
    setEditingSetId(currentData.set_id);
    setEditData(currentData);
  };

  const handleInputChange = (field: keyof SetInfo, value: number) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (editingSetId !== null) {
      await updateSetInfo(editData);
      receiveUpdatedSet(editData); // 수정된 세트 데이터 전달
      setEditingSetId(null); // 저장 후 수정 모드 해제
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
    } catch (error) {
      console.log("debug >>> error:", error);
    }
  };

  const deleteSetInfo = async (setId: number) => {
    try {
      const response = await api.delete('record/exercise/delete/set', {
        headers: { Authorization: `Bearer ${token}` },
        params: { set_id: setId }
      });
      console.log("debug >>> delete Set : ", response.data);
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
                    <InfoText>
                      무게: <input type="number" value={editData.weight} onChange={(e) => handleInputChange("weight", parseInt(e.target.value))} /> kg
                    </InfoText>
                    <InfoText>
                      횟수: <input type="number" value={editData.repetitions} onChange={(e) => handleInputChange("repetitions", parseInt(e.target.value))} /> 회
                    </InfoText>
                    <InfoText>
                      거리: <input type="number" value={editData.distance} onChange={(e) => handleInputChange("distance", parseFloat(e.target.value))} /> km
                    </InfoText>
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

const ControlButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  background-color: #e9ecef;
  color: #6c757d;
  border: none;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #ced4da;
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(108, 117, 125, 0.4);
  }
`;

const SaveButton = styled.button`
  margin-top: 8px;
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #218838;
  }
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;