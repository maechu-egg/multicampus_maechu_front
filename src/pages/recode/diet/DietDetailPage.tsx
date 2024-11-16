import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../services/api/axios';
import { useAuth } from '../../../context/AuthContext';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import ItemInfo from 'components/ui/record/list/diet/ItemInfo';
import SelectItemModal from 'components/ui/record/modal/diet/SelectItemModal';

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
          console.error("debug >>> diet 테이블이 존재하지 않습니다");
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
  
  // 삭제된 ItemInfo ItemPage에 넘겨줌
  const deleteItem = (deletedItemId: number) => {
    setItemData((prevItemData) =>
      prevItemData.filter((item) => item.item_id !== deletedItemId)
    );
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
            <p>{totalFat}</p>
          </StatItem>
        </StatsSection>
      </SummaryCard>

      <SearchBar>
        <input
          type="text"
          placeholder="식품을 검색하세요"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
        }}
        />
        <button onClick={nutrientsApiGet}>
          검색
        </button>
      </SearchBar>
      <ItemList>
        {Array.isArray(itemData) && itemData.map((item, index) => (
          <ItemInfo
            key={index}
            item={item}
            receiveDeletedItem={deleteItem}
          />
        ))}
      </ItemList>
        {isSelectApiBoolean && (
          <SelectItemModal
          apiList={apiList}
          onClose={() => setIsSelectApiBoolean(false)}
          onSave={() => dietGet}
          dietId={dietId}  
          />
        )}

    </Container>
  );
};

export default DietDetailPage;

const Container = styled.div`
  width: 70%;
  height: 100vh;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  font-family: 'Noto Sans KR', sans-serif;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    padding: 15px 60px 15px 20px; /* 오른쪽에 버튼 공간 확보 */
    border: none;
    border-radius: 10px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 16px;
    
    &:focus {
      outline: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    padding: 8px 16px;
    background-color: #bfc4c9;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    
    &:hover {
      background-color: #45a049;
    }
  }
`;

const ItemList = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 12px;
  }
`;



//   // 식단 리스트 가져오기
//   const dietGet = async () => {
//     if (memberId !== undefined && state.token) {
//       try {
//         const token = state.token;
//         const response = await api.post('record/diet/get/diet', {
//           meal_type: food,
//           record_date: selectedDate,
//         }, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });
        
//         console.log("debug >>> dietGet response : " + response.data);

//         return response.data.diet_id;

//       } catch (err) {
//           console.error('식단 데이터를 가져오는 중 오류 발생:', err);
//       }
//     }
//   };

//   // 식품 리스트 가져오기
// const itemGet = async (diet_id: number) => {
//   try {
//     console.log("debug >>> data", diet_id);

//     const response = await api.get("record/diet/get/items", {
//       headers: { Authorization: `Bearer ${state.token}` },
//       params: { diet_id },
//     });

//     console.log("debug >>> item Info : ", response.data);
    
//     // 식품 정보 리턴
//     return response.data

//   } catch (error) {
//     console.error("debug >>> error", error);
//   }
// }