import React, { useState } from "react";
import styled from "styled-components";

interface QuantitySetModalProps {
  searchTerm: string;
  nutrient: Nutrient;
  onClose: () => void;
  onSave: (foodCalculateDTO: FoodCalculateDTO) => void;
}

interface Nutrient {
  foodClass: string;
  foodNm: string;
  energy: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  nat: number;
  chole: number;
  fatsat: number;
  fatrn: number;
  cal: number;
}


interface FoodCalculateDTO {
  foodNm: string;
  inputQuantity: number; // 사용자가 입력한 quantity
  energy: number;
  carbs: number;
  protein: number;
  fat: number;
  diet_id: number;  
}

const QuantitySetModal = ({ searchTerm, nutrient, onClose, onSave }: QuantitySetModalProps): JSX.Element => {
  // 양
  const [quantity, setQuantity] = useState<number | undefined>();

  const handleSave = () => {
    // Nutrient -> FoodCalculateDTO 변환
    if(quantity){
    const foodCalculateDTO: FoodCalculateDTO = {
      foodNm: nutrient.foodNm,
      inputQuantity: quantity,
      energy: (nutrient.energy * quantity) / 100,
      carbs: (nutrient.carbs * quantity) / 100,
      protein: (nutrient.protein * quantity) / 100,
      fat: (nutrient.fat * quantity) / 100,
      diet_id: 0, // `diet_id`는 SelectItemModal에서 추가 설정
    };

    onSave(foodCalculateDTO); // 부모 컴포넌트에 변환된 데이터 전달
    } else {
        alert("양식에 맞춰 입력해주세요");
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>식품 추가</h3>
        <Label>식품명 : {searchTerm}</Label>
        <Label>
          양(g) :
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            placeholder="양을 입력해주세요"
          />
        </Label>
        <ButtonContainer>
          <SaveButton onClick={handleSave}>저장</SaveButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default QuantitySetModal;

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

  @media (max-width: 768px) {
    width: 350px;
    padding: 18px;
  }

  @media (max-width: 375px) {
    width: 300px;
    padding: 15px;
  }
  
  @media (max-width: 320px) {
    width: 270px;
    padding: 15px;
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

  input, select {
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

    @media (max-width: 375px) {
      padding: 6px;
      font-size: 12px;
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

  @media (max-width: 375px) {
    margin-top: 15px;
  }
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: #1d2636;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #16202b;
  }

  @media (max-width: 768px) {
    padding: 9px 18px;
    font-size: 13px;
  }

  @media (max-width: 375px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: #1d2636;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #16202b;
  }

  @media (max-width: 768px) {
    padding: 9px 18px;
    font-size: 13px;
  }

  @media (max-width: 375px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;
