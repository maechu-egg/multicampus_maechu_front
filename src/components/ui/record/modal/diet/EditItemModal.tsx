import React, { useState } from "react";
import styled from "styled-components";

interface EditItemModalProps {
    onClose: () => void;
    onSave: (updatedQuantity: number) => void;
}

const EditItemModal = ({onClose, onSave}: EditItemModalProps): JSX.Element => {
    const [updatedQuantity,setUpdatedQuantity] = useState(0);

    const handleSave = () => {
        onSave(updatedQuantity); // 부모 컴포넌트로 수정된 값 전달
        onClose();
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