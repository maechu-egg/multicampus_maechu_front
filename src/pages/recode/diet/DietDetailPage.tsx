import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import api from '../../../services/api/axios';
import { useAuth } from '../../../context/AuthContext';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import ItemInfo from 'components/ui/record/list/diet/ItemInfo';
import SelectItemModal from 'components/ui/record/modal/diet/SelectItemModal';
import MealUpdateModal from 'components/ui/record/modal/diet/MealUpdateModal';

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


function DietDetailPage(): JSX.Element {
  const { selectedDate, food } = useParams<{ selectedDate: string; food: string }>();
  const { state } = useAuth();
  const token = state.token;
  const memberId = state.memberId;
  const navigate = useNavigate();

  // openApi를 통해 받아온 식품들
  const [apiList,setApiList] = useState<Nutrient[]>([]);

  // ItemInfo로 하나씩 나열할 식품 배열
  const [itemData,setItemData] = useState<ItemResponseDTO[]>([]);
  const [dietId,setDietId] =useState(0);
  // meal 영양성분
  const totalCarbs = itemData.reduce((acc, item) => acc + item.carbs, 0);
  const totalProtein = itemData.reduce((acc, item) => acc + item.protein, 0);
  const totalFat = itemData.reduce((acc, item) => acc + item.fat, 0);
  const totalCalories = itemData.reduce((acc, item) => acc + item.calories, 0);
  
  // openApi 식품 리스트 나열 모달 트리거
  const [isSelectApiBoolean,setIsSelectApiBoolean] = useState<boolean>(false);
  // 추가할 식품
  const [searchTerm, setSearchTerm] = useState("");
  // 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isUpdateDropdownOpen, setIsUpdateDropdownOpen] = useState<boolean>(false); 

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (!state.token) {
        console.log("debug >>> token is null");
        navigate("/loginpage");
        return;
      }
  
      console.log("debug >>> token : " + state.token);
      console.log("debug >>> memberId : " + memberId);

      dietGet();
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 식품 리스트 가져오기
  const dietGet = async () => {
    if (memberId !== undefined && state.token) {
      try {
        const response = await api.post('record/diet/get/diet-and-items', {
          meal_type: food,
          record_date: selectedDate,
        }, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        console.log("debug >>> dietGet response : ", response.data);
  
        if (response.data) {
          // diet_id 설정
          setDietId(response.data.diet_id);
          console.log("debug >>> dietId : " + response.data.diet_id);
        
          // itemList가 배열인지 확인 후 설정
          setItemData(Array.isArray(response.data.itemList) ? response.data.itemList : []);
          console.log("debug >>> ItemData : ", response.data.itemList);

        } else {
          console.log("debug >>> diet 테이블이 존재하지 않습니다");
        }

      } catch (err) {
        console.error('식단 데이터를 가져오는 중 오류 발생:', err);
        setItemData([]); // 오류 발생 시 빈 배열로 설정
      }
    }
  };

  // openApi 호출 함수
  const nutrientsApiGet = async () => {
    try {
      const response = await api.get("record/api/nutrient", {
       params: { foodNm : searchTerm }, 
       headers: { Authorization: `Bearer ${token}` }
      });

      console.log("debug >>> item api get : ", response);
      setApiList(response.data);
      setIsSelectApiBoolean(true);
    } catch (error) {
      console.error("debug >>> error", error);
    }
  };

  const getSelectItem = async () => {
    try {
      await dietGet(); // dietGet을 호출해서 최신 데이터를 가져옴
      setIsSelectApiBoolean(false);
    } catch (error) {
      console.error('debug >>> getSelectItem error:', error);
    }
  }

  // 삭제된 ItemInfo ItemPage에 넘겨줌
  const deleteItem = (deletedItem: ItemResponseDTO) => {
    setItemData((prevItemData) => {
      const updatedItemData = prevItemData.filter((item) => item !== deletedItem);
      return updatedItemData;
    });
  };

  const navigateDietPage = () => {
    navigate(`/record/diet/${selectedDate}`);
  };

  const itemSave = (updatedItem: any) => {
    // 기존 데이터를 복사하여 임시 리스트 생성
    const updatedItemData = itemData.map((item) =>
      item.item_id === updatedItem.exercise_id ? updatedItem : item
    );
  
    setItemData(updatedItemData);
  
    // 변경된 상태를 로깅하여 확인
    console.log("debug >>> updatedExerciseData : ", updatedItemData);  
  };

  const deleteDiet = async () => {  
    try{
      const response = await api.delete('record/diet/delete/meal',{
        params: { diet_id : dietId },
        headers: { Authorization: `Bearer ${token}` }
      });

      
      response.data === 1 ? console.log("debug >>> delete success !!")
                          : console.log("debug >>> delete fail !!")
      navigateDietPage();
    } catch(error) {
      console.log("debug >>> error: " + error );
    }  
  };

  const editDiet = async (meal:string) => {  

    console.log("debug >>> editDiet 시작");
    
    try{
      const response = await api.put('record/diet/update/meal',
        { diet_id : dietId,
          meal_type : meal.toUpperCase()
        },
        { headers : { Authorization: `Bearer ${token}` }}
      );

      response.data === null ? console.log("debug >>> update fail !!")
                          : navigate(`/record/diet/${selectedDate}/${meal}`);
      setIsUpdateDropdownOpen(false);                          
    } catch(error) {
      console.log("debug >>> error: " + error );
    }  
  };

  // 날짜 포맷
  const getFormattedDate = () => {
    try {
      if (!selectedDate) return new Date();
      return parse(selectedDate, 'yyyy-MM-dd', new Date());
    } catch (error) {
      console.error('날짜 변환 에러:', error);
      return new Date();
    }
  };

  const date = getFormattedDate();

  return (
    <>
      <GlobalStyle /> {/* 전역 스타일 적용 */}
      <Container>
        <SummaryCard>
          <DateSection>
            <h2>{format(date, 'yyyy.MM.dd')}</h2>
            <p>{format(date, 'EEEE', { locale: ko })}</p>
          </DateSection>
          <StatsSection>
            <StatItem>
              <h3>오늘 먹은 칼로리</h3>
              <p>{totalCalories} kcal</p>
            </StatItem>
            <StatItem>
              <h3>탄수화물</h3>
              <p>{totalCarbs} g</p>
            </StatItem>
            <StatItem>
              <h3>단백질</h3>
              <p>{totalProtein} g</p>
            </StatItem>
            <StatItem>
              <h3>지방</h3>
              <p>{totalFat} g</p>
            </StatItem>
          </StatsSection>
        </SummaryCard>
        <SearchBar>
          <input
            type="text"
            placeholder="무슨 음식을 먹었나요?"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value);
          }}
          />
          <button onClick={nutrientsApiGet}>
            검색
          </button>
        </SearchBar>
        <CogWrapper ref={dropdownRef}>
          <FaCog onClick={() => setIsDropdownOpen((prev) => !prev)} />
          {isDropdownOpen && dietId !== 0 && (
            <DropdownMenu>
              <button onClick={() => setIsUpdateDropdownOpen(true)}>
                식단 수정
              </button>
              <button onClick={() => deleteDiet()}>
                  식단 삭제
                </button>
            </DropdownMenu>
          )}
        </CogWrapper>
        <ItemList>
          {Array.isArray(itemData) && itemData.map((item, index) => (
            <ItemInfo
              key={index}
              item={item}
              receiveUpdatedItem={itemSave}
              receiveDeletedItem={deleteItem}
            />
          ))}
        </ItemList>
          {isSelectApiBoolean && (
            <SelectItemModal
            searchTerm={searchTerm}
            apiList={apiList}
            onClose={() => setIsSelectApiBoolean(false)}
            onSave={getSelectItem}
            dietId={dietId}  
            />
          )}
        {isUpdateDropdownOpen && (
            <MealUpdateModal
              onClose = {() => setIsUpdateDropdownOpen(false)}
              onSave ={(meal:string) => editDiet(meal)}
            />
          )
        }
      </Container>
    </>
  );
};

export default DietDetailPage;

// 전역 스타일 추가
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #b6c0d3; // 전체 배경색 설정
    margin: 0; // 기본 마진 제거
    padding: 0; // 기본 패딩 제거
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: none;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const DateSection = styled.div`
  text-align: left;
  
  h2 {
    font-size: 24px;
    margin: 0;
    font-weight: 700;
  }
  
  p {
    color: #868e96;
    margin: 5px 0 0 0;
  }
`;

const StatsSection = styled.div`
  display: flex;
  gap: 30px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  
  h3 {
    font-size: 14px;
    color: #868e96;
    margin: 0 0 5px 0;
  }
  
  p {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: #212529;
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 30px;

  input {
    width: 100%;
    padding: 15px;
    border: 1px solid #ced4da;
    border-radius: 10px;
    background: white;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #2e5987;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }

  button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    padding: 8px 16px;
    background: #1D2636;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
    
    &:hover {
      background: #333C4D;
    }
  }
`;

const CogWrapper = styled.div`
  display: flex;
  justify-content: flex-end; /* 우측 정렬 */
  margin: 10px 0; /* 위아래 여백 추가 */
  
  svg {
    cursor: pointer;
    font-size: 24px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  background-color: #414d60; /* 배경색 변경 */
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;

  button {
    display: block;
    width: 100%;
    padding: 10px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    color: white; /* 글씨 색상 변경 */

    &:hover {
      background-color: #2c2e30; /* hover 시 배경색 변경 */
    }
  }
`;

const ItemList = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: transparent;  

  @media (max-width: 768px) {
    padding: 12px;
  }
`;
