import React, { useState, useEffect } from "react";
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
    receiveDeletedItem: (deletedItemId: number) => void;    
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

const ItemInfo = ({item, receiveDeletedItem}: ItemInfoProps): JSX.Element => {
  const { state } = useAuth();
  const token = state.token;
  
  const [itemData,setItemData] = useState<ItemResponseDTO>({
    item_id: 0,
    item_name: "",
    quantity: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    calories: 0,
    diet_id: 0       
  });
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setItemData(item);
  }, []);

  const closeItemModal = () => {
      setIsEditModalOpen(false);
  };
  
  const openItemModal = () => {
    setIsEditModalOpen(true);
  };
    
  const updateItemInfo = async (quantity: number) => {
  
      const rate = quantity / itemData.quantity;
      
      const updatedCalories = Math.floor(itemData.calories * rate);
      const updatedCarbs = Math.floor(itemData.carbs * rate);
      const updatedProtein = Math.floor(itemData.protein * rate);
      const updatedFat = Math.floor(itemData.fat * rate);
      
      const updatedItem:ItemResponseDTO = {
        ...itemData,
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
        setItemData(updatedItem);
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
      receiveDeletedItem(item.item_id);
    } catch(error) {
        console.log("debug >>> error : " + error );
    }
  };      

  return (
    <ItemPoint>
    <InfoText>식품명 : {itemData.item_name}</InfoText>
    <InfoText>양 : {itemData.quantity} g</InfoText>
    <InfoText>칼로리 : {itemData.calories} kcal</InfoText>
    <InfoText>탄수화물 : {itemData.carbs} g</InfoText>
    <InfoText>단백질 : {itemData.protein} g</InfoText>
    <InfoText>지방 : {itemData.fat} g</InfoText>
    <ControlButtonContainer>
        <ControlButton onClick={openItemModal}>+</ControlButton>
        <ControlButton onClick={deleteItemInfo}>-</ControlButton>
    </ControlButtonContainer>
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
  padding: 16px;
  margin: 16px 0;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  position: relative; /* 자식 요소의 절대 위치를 위한 설정 */

  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 12px;
    margin: 8px 0;
  }
`;

const InfoText = styled.p`
  margin: 8px 0;
  color: #4a4a4a;
  font-size: 1rem;
  font-weight: 550;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ControlButtonContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
`;

const ControlButton = styled.button`
  padding: 4px 8px;
  background-color: #fafafa;
  color: #1d2636;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0 7px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.3);
  }

  &:focus { 
    box-shadow: 0 0 0 3px #1d2636;
  }
`;


