import React, { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import styled from "styled-components";
import api from "../../../../../services/api/axios";
import EditItemModal from "../../modal/diet/EditItemModal"

interface ItemInfoProps {
    item :{
        item_id: number;
        item_name: string;
        quantity: number;
        carbs: number;
        protein: number;
        fat: number;
        calories: number;
        diet_id: number;  
    };
    receiveDeletedItem: (deletedItem: ItemResponseDTO) => void;
    receiveUpdatedItem: (updatedItem: any) => void;
    key: number;    
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

const ItemInfo = ({key,item, receiveUpdatedItem, receiveDeletedItem}: ItemInfoProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;
    
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const closeItemModal = () => {
      setIsEditModalOpen(false);
  };
  
  const openItemModal = () => {
    setIsEditModalOpen(true);
  };
    
  const updateItemInfo = async (quantity: number) => {
  
      const rate = quantity / item.quantity;
      
      const updatedCalories = Math.floor(item.calories * rate);
      const updatedCarbs = Math.floor(item.carbs * rate);
      const updatedProtein = Math.floor(item.protein * rate);
      const updatedFat = Math.floor(item.fat * rate);
      
      const updatedItem:ItemResponseDTO = {
        ...item,
        quantity,
        calories: updatedCalories,
        carbs: updatedCarbs,
        protein: updatedProtein,
        fat: updatedFat
      };
    
      try {
        console.log("debug >>> updatedItem : ", updatedItem);
    
        const response = await api.put("record/diet/update/item", updatedItem, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        console.log("debug >>> response from server : ", response.data);
        
        receiveUpdatedItem(updatedItem);

        closeItemModal();
      } catch (error) {
        console.log("debug >>> error : ", error);
      }
  };
  
  const deleteItemInfo = async () => {
    try{
      const response = await api.delete("record/diet/delete/item",{
        headers: { Authorization: `Bearer ${token}` },
        params : { item_id : item.item_id }
      });
  
      console.log("debug >>> delete row : " + response.data);
      receiveDeletedItem(item);
    } catch(error) {
        console.log("debug >>> error : " + error );
    }
  };      

  return (
    <ItemPoint>
      <HeaderBar>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <HeaderIcon>🍽️</HeaderIcon>
          <HeaderText>{item.item_name}</HeaderText>
        </div>
        <ControlButtonContainer>
          <ControlButton onClick={openItemModal}>+</ControlButton>
          <ControlButton onClick={deleteItemInfo}>-</ControlButton>
        </ControlButtonContainer>
      </HeaderBar>
    <InfoText>양 : {item.quantity} g</InfoText>
    <InfoText>칼로리 : {item.calories} kcal</InfoText>
    <InfoText>탄수화물 : {item.carbs} g</InfoText>
    <InfoText>단백질 : {item.protein} g</InfoText>
    <InfoText>지방 : {item.fat} g</InfoText>
    {isEditModalOpen && (
      <EditItemModal
      onClose={closeItemModal}
      onSave={updateItemInfo}
        />
    )}      
    </ItemPoint>
  );
};
export default ItemInfo;

const ItemPoint = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 16px 0;
  border-radius: 12px;
  border: none;
  background-color: #fafafa;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  position: relative; /* 자식 요소의 절대 위치를 위한 설정 */
  width: 100%;

  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    margin: 8px 0;
  }
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #021D39;
  padding: 8px 16px;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const InfoText = styled.p`
  margin: 8px 25px;
  color: #4a4a4a;
  font-family: 'ONE-Mobile-Title';
  font-size: 1rem;
  font-weight: 550;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ControlButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  padding: 4px 8px;
  background-color: #021D39;
  color: #fff;
  border: none;
  cursor: pointer;
  font-family: 'ONE-Mobile-Title';
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0 7px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.3);
  }

  &:focus { 
    box-shadow: 0 0 0 3px #4A5568;
  }
`;
const HeaderIcon = styled.div`
  margin-right: 10px;
  font-size: 1.5rem;
  color: #fff;
`;

const HeaderText = styled.h2`
  color: #fff;
  font-family: 'ONE-Mobile-Title';
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1px;
`;
