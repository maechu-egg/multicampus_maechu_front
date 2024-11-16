import React, { useState } from "react";
import { useParams } from 'react-router-dom';

import styled from "styled-components";
import QuantitySetModal from "./QuantitySetModal";
import api from "../../../../../services/api/axios"
import { useAuth } from "../../../../../context/AuthContext";


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

interface SelectItemModalProps {
  apiList: Nutrient[];
  onClose: () => void;
  onSave: () => void;
  dietId: number;
}

const SelectItemModal = ({ apiList, onClose, onSave, dietId }: SelectItemModalProps): JSX.Element => {

  const { state } = useAuth();
  const token = state.token;

  // url path
  const { selectedDate, food } = useParams<{ selectedDate: string; food: string }>();  

  const [selectedItem, setSelectedItem] = useState<Nutrient | null>(null);
  const [diet,setDIet] = useState<number>(dietId);
  const [quantiy,setQuantity] = useState<number>(0);
  const [getDietId,setGetDietId] = useState<number>(0);

  // 식단 추가 함수
  const dietInsert = async () => {
    try {
      const response = await api.get("record/diet/insert/meal", {
        params: { mealtype : food }, 
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("debug >>> exercise Insert : ", response.data);
      setGetDietId(response.data); // 운동 ID 설정

    } catch (error) {
      console.error("debug >>> error", error);
    }
  };

  // 식품 추가 함수
  const itemInsert = async () => {
    try {
      const response = await api.post("record/diet/insert/item", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("debug >>> exercise Insert : ", response.data);
      setGetDietId(response.data); // 운동 ID 설정

    } catch (error) {
      console.error("debug >>> error", error);
    }
  };  

  const getQuantity = (quantity:number) => {
    setQuantity(quantity);
    setSelectedItem(null);

  };

  // 아이템 클릭 핸들러
  const handleItemClick = (item: Nutrient) => {
    setSelectedItem(item);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Header>
          <h3>검색 결과</h3>
          <CloseButton onClick={onClose}>닫기</CloseButton>
        </Header>
        <ItemList>
          {apiList.length > 0 ? (
            apiList.map((item, index) => (
              <ItemCard key={index} onClick={() => handleItemClick(item)}>
                <h4>{item.foodNm}</h4>
                <p>칼로리: {item.energy} kcal</p>
                <p>탄수화물: {item.carbs} g, 단백질: {item.protein} g, 지방: {item.fat} g</p>
              </ItemCard>
            ))
          ) : (
            <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
          )}
        </ItemList>
      </ModalContent>

      { selectedItem && (
        <QuantitySetModal
          searchTerm={selectedItem.foodNm}
          onClose={() => setSelectedItem(null)}
          onSave={getQuantity}
        />
      )}
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 500px;
  max-height: 80%;
  background: #fff;
  border-radius: 10px;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 1.5rem;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemCard = styled.div`
  padding: 15px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;

  h4 {
    margin: 0 0 8px;
    font-size: 1.2rem;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }

  &:hover {
    background: #f1f1f1;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #999;
`;