import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import api from "../../../../services/api/axios";
import { useAuth } from "context/AuthContext";

interface ItemAddModalProps {
  dietId: number;
  searchTerm: string;
  onClose: () => void;
  successItemInsert: (successBoolean: boolean) => void;
}

const ItemAddModal = ({ dietId ,searchTerm, onClose, successItemInsert }: ItemAddModalProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;
  // url path
  const { selectedDate, food } = useParams<{ selectedDate: string; food: string }>();
  // 식품명
  const itemName = searchTerm;
  // 양
  const [quantity,setQuantity] = useState(0);
  // 식단 없으면 생성해서 받는 식단 ID
  const [getDietId,setGetDietId] = useState(0);


  // 식단 추가 함수
  const dietInsert = async () => {
    try {
      const response = await api.post("record/diet/insert/meal", {
       params: { mealtype : food }, 
       headers: { Authorization: `Bearer ${token}` }
      });

      console.log("debug >>> exercise Insert : ", response.data);
      setGetDietId(response.data); // 운동 ID 설정

    } catch (error) {
      console.error("debug >>> error", error);
    }
  };

  // 저장 버튼 클릭 시
  const handleSave = async () => {
    successItemInsert(true);
    onClose(); // 모달 닫기
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>식품 추가</h3>
        <Label>
          식품명 : {itemName}
        </Label>
        <Label>
          양(g) :
          <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
        </Label>
        <ButtonContainer>
          <SaveButton onClick={handleSave}>저장</SaveButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ItemAddModal;

// 스타일 정의
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