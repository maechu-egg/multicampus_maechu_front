import React, { useState } from "react";
import styled from "styled-components";


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
    cal: number
  
  }

interface SelectItemModalProps {
    apiList: Nutrient[];
    onClose: () => void;
}


const SelectItemModal = ({apiList, onClose}: SelectItemModalProps): JSX.Element => {
    onClose();
    
    const api = apiList;
    
    return (
        <h3>api</h3>
    );
};

export default SelectItemModal;