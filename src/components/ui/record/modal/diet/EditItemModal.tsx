import React, { useState } from "react";
import styled from "styled-components";

interface EditItemModalProps {
    onClose: () => void;
    onSave: (updatedQuantity: number) => void;
}

const EditItemModal = ({onClose, onSave}: EditItemModalProps): JSX.Element => {
    const [updatedQuantity,setUpdatedQuantity] = useState<number | undefined>(undefined);

    const handleSave = () => {
      if(updatedQuantity){
        onSave(updatedQuantity); // 부모 컴포넌트로 수정된 값 전달
        onClose();
      } else {
        alert("양식에 맞춰 입력해주세요");
      }
    };

    return (
        <ModalOverlay>
          <ModalContent>
            <h3>식품 정보 수정</h3>
            <label>
              양
              <input
                type="number"
                value={updatedQuantity}
                onChange={(e) => setUpdatedQuantity(parseInt(e.target.value))}
                placeholder="양을 입력해주세요"
              />
            </label>
            <ButtonContainer>
              <SaveButton onClick={handleSave}>저장</SaveButton>
              <CancelButton onClick={onClose}>취소</CancelButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
    );

}
export default EditItemModal;


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
  background: white;
  padding: 30px 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-out forwards;
  text-align: center;
  font-family: 'ONE-Mobile-Title';

  h3 {
    font-size: 1.5rem;
    color: #2c3e50;
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
    color: #2c3e50;
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
    border: 1px solid #bdc3c7;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border 0.3s;

    &:focus {
      border-color: #3498db;
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

const SaveButton = styled.button`
  padding: 12px 20px;
  background-color: #1d2636;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #414d60;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(29, 38, 54, 0.6);
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

const CancelButton = styled.button`
  padding: 12px 20px;
  background-color: #1d2636;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #414d60;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(29, 38, 54, 0.6);
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
