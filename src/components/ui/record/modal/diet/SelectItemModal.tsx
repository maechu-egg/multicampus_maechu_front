import React, { useState } from "react";
import { useParams } from 'react-router-dom';

import styled from "styled-components";
import QuantitySetModal from "./QuantitySetModal";
import api from "../../../../../services/api/axios"
import { useAuth } from "../../../../../context/AuthContext";
import CustomItemModal from "./CustomItemModal";

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
interface ItemRequestDTO {
  item_name: string;
  quantity: number;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  diet_id: number;  
}

interface ItemResponseDTO {
  item_id: number;
  item_name: string;
  quantity: number;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  diet_id: number;  
}
interface SelectItemModalProps {
  itemList: ItemResponseDTO[]
  searchTerm: string;
  apiList: Nutrient[];
  onClose: () => void;
  onSave: () => void;
  dietId: number;
}

const SelectItemModal = ({ itemList,searchTerm ,apiList, onClose, onSave, dietId }: SelectItemModalProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;

  const { selectedDate, food } = useParams<{ selectedDate: string; food: string }>();  

  const [selectedItem, setSelectedItem] = useState<Nutrient | null>(null);
  const [foodCalculateDTO, setFoodCalculateDTO] = useState<FoodCalculateDTO | null>(null); // 변환된 데이터 저장
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  // 식단 추가 함수
  const dietInsert = async (): Promise<number | null> => {
    try {
      const response = await api.get("record/diet/insert/meal", {
        params: { meal_type: food?.toUpperCase() }, // mealtype을 URL에서 가져옴
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("debug >>> diet Insert : ", response.data);
      return response.data; // 새로 생성된 diet_id 반환
    } catch (error) {
      console.error("debug >>> dietInsert error: ", error);
      return null;
    }
  };

  // 식품 추가 함수
  const itemInsert = async (dto: FoodCalculateDTO) => {
    // FoodCalculateDTO -> ItemRequestDTO 변환
    const itemRequestDTO: ItemRequestDTO = {
      item_name: dto.foodNm,
      quantity: dto.inputQuantity,
      carbs: parseFloat(dto.carbs.toFixed(2)),
      protein: parseFloat(dto.protein.toFixed(2)),
      fat: parseFloat(dto.fat.toFixed(2)),
      calories: Math.round(dto.energy), // 소수점 제거
      diet_id: dto.diet_id,
    };
  
    console.log("debug >>> itemRequestDTO : " + itemRequestDTO);

    try {
      const response = await api.post("record/diet/insert/item", itemRequestDTO, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("debug >>> item Insert : ", response.data);
    } catch (error) {
      console.error("debug >>> itemInsert error: ", error);
    }
  };

  // `QuantitySetModal`에서 전달받은 FoodCalculateDTO 처리
  const handleSave = async (dto: FoodCalculateDTO) => {

    // 이미 존재하는 식품인지 확인
    const isDuplicate = itemList.some((item) => item.item_name === dto.foodNm);

    if (isDuplicate) {
      alert("해당 식품이 이미 존재합니다.");

      setSelectedItem(null); // 선택 초기화
      setIsCustomModalOpen(false);  
      return;
    }
    
    if (dietId === 0) {
      // dietId가 0일 경우: 식단 추가 후 식품 추가
      const newDietId = await dietInsert();
      if (newDietId) {
        dto.diet_id = newDietId; // 새로 생성된 diet_id 설정
        await itemInsert(dto); // 식품 추가
      }
    } else {
      // dietId가 0이 아닐 경우: 식품 추가만
      dto.diet_id = dietId;
      await itemInsert(dto);
    }

    setFoodCalculateDTO(dto); // FoodCalculateDTO 저장하여 출력용으로 사용
    setSelectedItem(null); // 선택 초기화
    setIsCustomModalOpen(false);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Header>
          <h3>검색 결과</h3>
          <CloseButton onClick={ () => {foodCalculateDTO ? onSave() : onClose()} }>
            {foodCalculateDTO ? "완료" : "닫기"}
          </CloseButton>
        </Header>
        {!foodCalculateDTO && (
          <ItemList>
            {apiList.length > 0 ? (
              apiList.map((item, index) => (
                <ItemCard key={index} onClick={() => setSelectedItem(item)}>
                  <h4>{item.foodNm}</h4>
                  <p>칼로리: {item.energy} kcal</p>
                  <p>
                    탄수화물: {item.carbs} g, 단백질: {item.protein} g, 지방: {item.fat} g
                  </p>
                </ItemCard>
              ))
            ) : (
              <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
            )}
          </ItemList>
        )}

        {selectedItem && (
          <QuantitySetModal
            searchTerm={selectedItem.foodNm}
            nutrient={selectedItem}
            onClose={() => setSelectedItem(null)}
            onSave={handleSave}
          />
        )}
        {foodCalculateDTO && (
          <FoodInfo>
            <h4>추가된 식품 정보</h4>
            <p>식품명: {foodCalculateDTO.foodNm}</p>
            <p>양: {foodCalculateDTO.inputQuantity} g</p>
            <p>칼로리: {Math.round(foodCalculateDTO.energy)} kcal</p>
            <p>탄수화물: {foodCalculateDTO.carbs.toFixed(2)} g</p>
            <p>단백질: {foodCalculateDTO.protein.toFixed(2)} g</p>
            <p>지방: {foodCalculateDTO.fat.toFixed(2)} g</p>
          </FoodInfo>
        )}
        <Footer>
          {(
            !foodCalculateDTO &&
            <ManualEntryButton onClick={() => setIsCustomModalOpen(true)}>
              직접 입력
            </ManualEntryButton>
          )}
        </Footer>

        {isCustomModalOpen && (
          <CustomItemModal
            searchTerm={searchTerm}
            onClose={() => setIsCustomModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default SelectItemModal;

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
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  border: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    padding: 18px;
    max-width: 450px;
  }

  @media (max-width: 425px) {
    padding: 15px;
    max-width: 400px;
  }

  @media (max-width: 375px) {
    padding: 12px;
    max-width: 350px;
  }

  @media (max-width: 320px) {
    padding: 10px;
    max-width: 300px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 18px;
  }

  @media (max-width: 375px) {
    margin-bottom: 15px;
  }
`;

const CloseButton = styled.button`
  background: #1D2636;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  border-radius: 5px;
  padding: 10px 15px;

  &:hover {
    background: #16202b;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 9px 13px;
  }

  @media (max-width: 375px) {
    font-size: 16px;
    padding: 8px 12px;
  }
`;

const ItemList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 10px;
  padding-right: 10px;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #dddddd;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #cccccc;
  }

  @media (max-width: 768px) {
    max-height: 250px;
  }

  @media (max-width: 375px) {
    max-height: 200px;
  }
`;

const ItemCard = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #f1f1f1;
    transform: translateY(-2px);
  }

  h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #333333;

    @media (max-width: 768px) {
      font-size: 15px;
    }

    @media (max-width: 375px) {
      font-size: 14px;
    }
  }

  p {
    margin: 4px 0;
    font-size: 14px;
    color: #555555;

    @media (max-width: 768px) {
      font-size: 13px;
    }

    @media (max-width: 375px) {
      font-size: 12px;
    }
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  font-size: 16px;
  color: #999999;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-top: 18px;
  }

  @media (max-width: 375px) {
    font-size: 14px;
    margin-top: 15px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    padding: 14px;
  }

  @media (max-width: 375px) {
    padding: 12px;
  }
`;

const ManualEntryButton = styled.button`
  background-color: #1D2636;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #16202b;
  }

  @media (max-width: 768px) {
    padding: 9px 18px;
    font-size: 15px;
  }

  @media (max-width: 375px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const FoodInfo = styled.div`
  margin-top: 20px;
  background: #f7f7f7;
  border-left: 5px solid #1d2636;
  padding: 10px 15px;
  border-radius: 5px;

  h4 {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333333;

    @media (max-width: 768px) {
      font-size: 15px;
    }

    @media (max-width: 375px) {
      font-size: 14px;
    }
  }

  p {
    margin: 4px 0;
    font-size: 14px;
    color: #555555;

    @media (max-width: 768px) {
      font-size: 13px;
    }

    @media (max-width: 375px) {
      font-size: 12px;
    }
  }
`;
