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

const ItemInfo = ({item, receiveUpdatedItem, receiveDeletedItem}: ItemInfoProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;
    
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [itemInfo,setItemInfo] = useState<ItemResponseDTO>(item);
    
  const updateItemInfo = async (quantity: number) => {
  
      const rate = quantity / itemInfo.quantity;
      
      const updatedCalories = Math.floor(itemInfo.calories * rate);
      const updatedCarbs = parseFloat((itemInfo.carbs * rate).toFixed(2));
      const updatedProtein = parseFloat((itemInfo.protein * rate).toFixed(2));
      const updatedFat = parseFloat((itemInfo.fat * rate).toFixed(2));
      
      const updatedItem:ItemResponseDTO = {
        ...itemInfo,
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
        setItemInfo(updatedItem);

        setIsEditModalOpen(false);
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
          <ControlButton onClick={() => setIsEditModalOpen(true)}>+</ControlButton>
          <ControlButton onClick={deleteItemInfo}>-</ControlButton>
        </ControlButtonContainer>
      </HeaderBar>
    <InfoText>양 : {itemInfo.quantity} g</InfoText>
    <InfoText>칼로리 : {itemInfo.calories} kcal</InfoText>
    <InfoText>탄수화물 : {itemInfo.carbs} g</InfoText>
    <InfoText>단백질 : {itemInfo.protein} g</InfoText>
    <InfoText>지방 : {itemInfo.fat} g</InfoText>
    {isEditModalOpen && (
      <EditItemModal
      onClose={() => setIsEditModalOpen(false)}
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
  position: relative;
  width: 100%;

  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    margin: 12px 0;
  }

  @media (max-width: 425px) {
    margin: 10px 0;
  }

  @media (max-width: 375px) {
    margin: 8px 0;
  }

  @media (max-width: 320px) {
    margin: 6px 0;
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

  @media (max-width: 768px) {
    padding: 7px 14px;
  }

  @media (max-width: 425px) {
    padding: 6px 12px;
  }

  @media (max-width: 375px) {
    padding: 5px 10px;
  }

  @media (max-width: 320px) {
    padding: 4px 8px;
  }
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

  @media (max-width: 425px) {
    font-size: 0.85rem;
  }

  @media (max-width: 375px) {
    font-size: 0.8rem;
  }

  @media (max-width: 320px) {
    font-size: 0.75rem;
  }
`;

const ControlButtonContainer = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 7px;
  }

  @media (max-width: 425px) {
    gap: 6px;
  }

  @media (max-width: 375px) {
    gap: 5px;
  }

  @media (max-width: 320px) {
    gap: 4px;
  }
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

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 425px) {
    font-size: 1.2rem;
  }

  @media (max-width: 375px) {
    font-size: 1.1rem;
  }

  @media (max-width: 320px) {
    font-size: 1rem;
  }
`;

const HeaderIcon = styled.div`
  margin-right: 10px;
  font-size: 1.5rem;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 425px) {
    font-size: 1.3rem;
  }

  @media (max-width: 375px) {
    font-size: 1.2rem;
  }

  @media (max-width: 320px) {
    font-size: 1.1rem;
  }
`;

const HeaderText = styled.h2`
  color: #fff;
  font-family: 'ONE-Mobile-Title';
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 425px) {
    font-size: 1rem;
  }

  @media (max-width: 375px) {
    font-size: 0.95rem;
  }

  @media (max-width: 320px) {
    font-size: 0.9rem;
  }
`;
