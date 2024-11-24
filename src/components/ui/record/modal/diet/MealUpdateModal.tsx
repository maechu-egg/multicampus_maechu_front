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
            <option value="" disabled selected hidden>선택하세요</option>              
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
              <SaveButton primary onClick={async() => onSave(selectedMeal)}>저장</SaveButton>
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
  width: 80%;
  max-width: 400px;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out forwards;
  text-align: center;

  h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      font-size: 1.4rem;
      margin-bottom: 18px;
    }

    @media (max-width: 375px) {
      font-size: 1.3rem;
      margin-bottom: 15px;
    }
  }

  label {
    display: block;
    font-weight: bold;
    color: #666;
    margin-bottom: 12px;
    text-align: left;

    @media (max-width: 768px) {
      margin-bottom: 10px;
      font-size: 0.95rem;
    }

    @media (max-width: 375px) {
      margin-bottom: 8px;
      font-size: 0.9rem;
    }
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

    @media (max-width: 768px) {
      padding: 9px;
      font-size: 0.95rem;
    }

    @media (max-width: 375px) {
      padding: 8px;
      font-size: 0.9rem;
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

  @media (max-width: 768px) {
    padding: 9px;
    font-size: 15px;
  }

  @media (max-width: 375px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 18px;
  }

  @media (max-width: 375px) {
    margin-top: 15px;
  }
`;

const SaveButton = styled.button<{ primary?: boolean }>`
  padding: 12px 20px;
  background: ${({ primary }) => (primary ? 'linear-gradient(135deg, #1D2636, #333C4D)' : '#dc3545')};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${({ primary }) => (primary ? 'linear-gradient(135deg, #333C4D, #1D2636)' : '#c82333')};
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.6);
  }

  @media (max-width: 768px) {
    padding: 11px 18px;
    font-size: 0.95rem;
  }

  @media (max-width: 375px) {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
`;

const CancelButton = styled.button<{ primary?: boolean }>`
  padding: 12px 20px;
  background-color: #1D2636;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #333C4D;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.6);
  }

  @media (max-width: 768px) {
    padding: 11px 18px;
    font-size: 0.95rem;
  }

  @media (max-width: 375px) {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
`;


export default MealUpdateModal;