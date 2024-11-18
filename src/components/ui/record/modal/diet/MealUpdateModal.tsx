
import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import styled from "styled-components";

interface MealUpdateModalProps {
    onClose : () => void;
    onSave: (meal:string) => void;
}


const MealUpdateModal = ({onClose,onSave}:MealUpdateModalProps): JSX.Element => {

    const { selectedDate, food } = useParams<{ selectedDate: string; food: string }>();
    const [selectedMeal, setSelectedMeal] = useState<string>(''); // 선택된 식단 저장

    const handleMealChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const mealType = event.target.value;
        setSelectedMeal(mealType);
        console.log(`선택된 식단: ${mealType}`);
      };

    const mealOptions = ['breakfast', 'lunch', 'dinner', 'snack']; // 전체 식단 옵션


    return (
        <ModalOverlay>
          <ModalContent>            
            <MealSelect id="mealSelect" value={selectedMeal} onChange={handleMealChange}>
                <option value="" disabled>
                    선택하세요
                </option>
                {mealOptions
                    .filter((meal) => meal !== food) // food와 다른 옵션만 표시
                    .map((meal) => (
                    <option key={meal} value={meal}>
                       {meal === 'breakfast'
                    ? '아침'
                    : meal === 'lunch'
                    ? '점심'
                    : meal === 'dinner'
                    ? '저녁'
                    : meal === 'snack'
                    ? '간식'
                    : meal}
                    </option>
                ))}
            </MealSelect>         
            <ButtonContainer>
              <SaveButton onClick={async() => onSave(selectedMeal)}>저장</SaveButton>
              <CancelButton onClick={onClose}>취소</CancelButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
    );
}


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
  padding: 30px 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out forwards;
  text-align: center;

  h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 20px;
  }

  label {
    display: block;
    font-weight: bold;
    color: #666;
    margin-bottom: 12px;
    text-align: left;
  }

  input, select {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border 0.3s;

    &:focus {
      border-color: #007bff;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const MealSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #45a049;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
`;

const SaveButton = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.6);
  }
`;

const CancelButton = styled.button`
  padding: 12px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #c82333;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(220, 53, 69, 0.6);
  }
`;

export default MealUpdateModal;