import React, { useState } from "react";
import styled from "styled-components";

interface FoodCalculateDTO {
  foodNm: string;
  inputQuantity: number;
  energy: number;
  carbs: number;
  protein: number;
  fat: number;
  diet_id: number;
}

interface CustomItemModalProps {
  searchTerm: string;
  onClose: () => void;
  onSave: (dto: FoodCalculateDTO) => void;
}

const CustomItemModal = ({ searchTerm, onClose, onSave }: CustomItemModalProps): JSX.Element => {
    const [foodNm, setFoodNm] = useState<string>(searchTerm);
    const [inputQuantity, setInputQuantity] = useState<string>(""); // 빈 문자열로 초기화
    const [energy, setEnergy] = useState<string>("");
    const [carbs, setCarbs] = useState<string>("");
    const [protein, setProtein] = useState<string>("");
    const [fat, setFat] = useState<string>("");
  
    const handleSave = () => {
      const dto: FoodCalculateDTO = {
        foodNm,
        inputQuantity: Number(inputQuantity), // 빈 문자열은 0으로 처리
        energy: Number(energy),
        carbs: Number(carbs),
        protein: Number(protein),
        fat: Number(fat),
        diet_id: 0,
      };
      onSave(dto);
    };

    return (
        <ModalOverlay>
        <ModalContent>
          <Header>
            <h3>음식 정보 입력</h3>
          </Header>
          <Form>
            <FormItem>
              <label>음식 이름</label>
              <Input
                type="text"
                value={foodNm}
                onChange={(e) => setFoodNm(e.target.value)}
              />
            </FormItem>
            <FormItem>
              <label>양</label>
              <Input
                type="number"
                value={inputQuantity}
                onChange={(e) => setInputQuantity(e.target.value)} // 문자열로 처리
              />
            </FormItem>
            <FormItem>
              <label>칼로리</label>
              <Input
                type="number"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
              />
            </FormItem>
            <FormItem>
              <label>탄수화물</label>
              <Input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </FormItem>
            <FormItem>
              <label>단백질</label>
              <Input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </FormItem>
            <FormItem>
              <label>지방</label>
              <Input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
            </FormItem>
          </Form>
          <Actions>
            <Button onClick={handleSave}>저장</Button>
            <Button onClick={onClose} cancel>
              취소
            </Button>
          </Actions>
        </ModalContent>
      </ModalOverlay>
  );
};

export default CustomItemModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  width: 90%;
  max-width: 500px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 14px;
    color: #333333;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: #1D2636;
    box-shadow: 0 0 5px rgba(29, 38, 54, 0.5);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button<{ cancel?: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  color: ${(props) => (props.cancel ? "#1D2636" : "#ffffff")};
  background: ${(props) => (props.cancel ? "#f0f0f0" : "#1D2636")};
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.cancel ? "#e0e0e0" : "#16202b")};
  }
`;