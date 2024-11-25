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
    const [inputQuantity, setInputQuantity] = useState<undefined | number>(undefined); // 빈 문자열로 초기화
    const [energy, setEnergy] = useState<undefined | number>(undefined);
    const [carbs, setCarbs] = useState<undefined | number>(undefined);
    const [protein, setProtein] = useState<undefined | number>(undefined);
    const [fat, setFat] = useState<undefined | number>(undefined);
  
    const handleSave = () => {
      if(inputQuantity != null && energy != null && 
         carbs != null && protein != null && fat != null){

         const dto: FoodCalculateDTO = {
          foodNm,
          inputQuantity: inputQuantity, // 빈 문자열은 0으로 처리
          energy: energy,
          carbs: carbs,
          protein: protein,
          fat: fat,
          diet_id: 0,
        };
        onSave(dto);  
      } else {
        alert("양식에 맞춰 입력해주세요");
      }
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
                placeholder="음식을 입력해주세요"
              />
            </FormItem>
            <FormItem>
              <label>양</label>
              <Input
                type="number"
                value={inputQuantity}
                onChange={(e) => setInputQuantity(parseInt(e.target.value))} // 문자열로 처리
                placeholder="양을 입력해주세요"
              />
            </FormItem>
            <FormItem>
              <label>칼로리</label>
              <Input
                type="number"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                placeholder="칼로리를 입력해주세요"
              />
            </FormItem>
            <FormItem>
              <label>탄수화물</label>
              <Input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(parseFloat(e.target.value))}
                placeholder="탄수화물을 입력해주세요"
                step="0.01"
              />
            </FormItem>
            <FormItem>
              <label>단백질</label>
              <Input
                type="number"
                value={protein}
                onChange={(e) => setProtein(parseFloat(e.target.value))}
                placeholder="단백질을 입력해주세요"
                step="0.01"
              />
            </FormItem>
            <FormItem>
              <label>지방</label>
              <Input
                type="number"
                value={fat}
                onChange={(e) => setFat(parseFloat(e.target.value))}
                placeholder="지방을 입력해주세요"
                step="0.01"
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
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 18px;
    max-width: 450px;
  }

  @media (max-width: 425px) {
    padding: 10px;
    max-width: 400px;
  }

  @media (max-width: 375px) {
    padding: 8px;
    max-width: 350px;
  }

  @media (max-width: 320px) {
    padding: 5px;
    max-width: 300px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    margin-bottom: 18px;
    padding-bottom: 9px;
  }

  @media (max-width: 425px) {
    margin-bottom: 15px;
    padding-bottom: 8px;
  }

  @media (max-width: 375px) {
    margin-bottom: 12px;
    padding-bottom: 6px;
  }

  @media (max-width: 320px) {
    margin-bottom: 10px;
    padding-bottom: 5px;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 425px) {
    gap: 10px;
  }

  @media (max-width: 375px) {
    gap: 8px;
  }

  @media (max-width: 320px) {
    gap: 6px;
  }
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 14px;
    color: #333333;

    @media (max-width: 768px) {
      font-size: 13.5px;
    }

    @media (max-width: 425px) {
      font-size: 13px;
    }

    @media (max-width: 375px) {
      font-size: 12.5px;
    }

    @media (max-width: 320px) {
      font-size: 12px;
    }
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

  @media (max-width: 768px) {
    padding: 9px;
    font-size: 13.5px;
  }

  @media (max-width: 425px) {
    padding: 8px;
    font-size: 13px;
  }

  @media (max-width: 375px) {
    padding: 7px;
    font-size: 12.5px;
  }

  @media (max-width: 320px) {
    padding: 5px;
    font-size: 12px;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;

  @media (max-width: 768px) {
    margin-top: 18px;
    gap: 9px;
  }

  @media (max-width: 425px) {
    margin-top: 15px;
    gap: 8px;
  }

  @media (max-width: 375px) {
    margin-top: 12px;
    gap: 6px;
  }

  @media (max-width: 320px) {
    margin-top: 10px;
    gap: 5px;
  }
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

  @media (max-width: 768px) {
    padding: 9px 18px;
    font-size: 13.5px;
  }

  @media (max-width: 425px) {
    padding: 8px 15px;
    font-size: 13px;
  }

  @media (max-width: 375px) {
    padding: 7px 12px;
    font-size: 12.5px;
  }

  @media (max-width: 320px) {
    padding: 5px 10px;
    font-size: 12px;
  }
`;
