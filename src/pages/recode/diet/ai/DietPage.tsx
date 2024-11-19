import axios from "axios"; // axios import 추가
import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 import
import styled, { createGlobalStyle } from "styled-components";
import { useParams } from 'react-router-dom';
import DietPlanSection from "./DietPlanSection";
import CautionSection from "./CautionSection";


interface MealData {
  foods: string[];
  amounts: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

interface DietResponseDTO {
  diet_id: number;
  record_date: number;
  meal_type: string;
  member_id: number;
}

interface MealPlanData {
  breakfast: MealData;
  lunch: MealData;
  dinner: MealData;
  snack: MealData;
}

// 전역 스타일 추가
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #b6c0d3; // 전체 배경색 설정
    margin: 0; // 기본 마진 제거
    padding: 0; // 기본 패딩 제거
  }
`;

function DietPage() {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { state } = useAuth(); // 로그인한 사용자 정보 가져오기
  const memberId = state.memberId; // user 객체에서 memberId 가져오기
  const { selectedDate } = useParams<{ selectedDate: string}>();  
  const [data, setData] = useState<{
    bmr: number;
    tdee: number;
    weight: number;
    goal: string;
    recommendedCalories: number;
    recommendedProtein: number;
    recommendedCarb: number;
    recommendedFat: number;
  } | null>(null);
  
  const [dietList, setDietList] = useState<DietResponseDTO[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false); // 첫 번째 모달 상태
  const [isResultModalOpen, setIsResultModalOpen] = useState(false); //  째 모달 상태 추가
  const [dietPlan, setDietPlan] = useState<string | null>(null);

  // 사용자 입력 상태
  const [ingredients, setIngredients] = useState<string>("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [medicalConditions, setMedicalConditions] = useState<string>("");
  const [mealsPerDay, setMealsPerDay] = useState<string>("3");
  const [cookingPreference, setCookingPreference] = useState<string>("");

  // 모달 상태 추가
  const [isBreakfastDetailModalOpen, setIsBreakfastDetailModalOpen] = useState(false);
  const [isLunchDetailModalOpen, setIsLunchDetailModalOpen] = useState(false);
  const [isDinnerDetailModalOpen, setIsDinnerDetailModalOpen] = useState(false);
  const [isSnackDetailModalOpen, setIsSnackDetailModalOpen] = useState(false);
  const [meals, setMeals] = useState<MealPlanData | null>(null); // meals 상태 추가
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가


  const dietRecords = [
    { food: "breakfast"},
    { food: "lunch" },
    { food: "dinner" },
    { food: "snack" },
  ];
  const foodLabels = {
    breakfast: "아침",
    lunch: "점심",
    dinner: "저녁",
    snack: "간식",
  };


const getMealDataFromTable = (plan: any): MealPlanData => {
  const meals: MealPlanData = {
    breakfast: { foods: [], amounts: [], nutritionalInfo: [] },
    lunch: { foods: [], amounts: [], nutritionalInfo: [] },
    dinner: { foods: [], amounts: [], nutritionalInfo: [] },
    snack: { foods: [], amounts: [], nutritionalInfo: [] }
  };

  if (plan && plan.dietPlan) {
    const lines: string[] = plan.dietPlan.split('\n');
    let isTableData = false;

    lines.forEach((line: string) => {
      if (line.includes('| 식사') || line.includes('|------')) {
        isTableData = true;
        return;
      }

      if (isTableData && line.includes('|')) {
        const parts = line.split('|')
          .map(part => part.trim())
          .filter(part => part !== '');

        if (parts.length >= 5) {
          const [mealType, food, amount, calories, carbsProteinFat] = parts;
          const [carbs, protein, fat] = carbsProteinFat
            .replace(/[^\d,]/g, '')
            .split(',')
            .map(val => (val.trim() ? parseInt(val.trim()) : 0));

          const nutritionalInfo = {
            calories: isNaN(parseInt(calories)) ? 0 : parseInt(calories),
            carbs: isNaN(carbs) ? 0 : carbs,
            protein: isNaN(protein) ? 0 : protein,
            fat: isNaN(fat) ? 0 : fat,
          };

          if (mealType.includes('아침')) {
            meals.breakfast.foods.push(food);
            meals.breakfast.amounts.push(amount);
            meals.breakfast.nutritionalInfo.push(nutritionalInfo);
          } else if (mealType.includes('점심')) {
            meals.lunch.foods.push(food);
            meals.lunch.amounts.push(amount);
            meals.lunch.nutritionalInfo.push(nutritionalInfo);
          } else if (mealType.includes('저녁')) {
            meals.dinner.foods.push(food);
            meals.dinner.amounts.push(amount);
            meals.dinner.nutritionalInfo.push(nutritionalInfo);
          } else if (mealType.toLowerCase().includes('간식')) {
            meals.snack.foods.push(food);
            meals.snack.amounts.push(amount);
            meals.snack.nutritionalInfo.push(nutritionalInfo);
          }
        }
      }
    });
  }

  return meals;
};
  // ... existing code ...

  const handleAddMeal = async (mealType: keyof MealPlanData) => {
    console.log("debug: mealType", mealType);
    if (!meals || !meals[mealType]) {
      console.error(`No meal data available for ${mealType}`);
      alert(`${mealType}에 대한 데이터가 없습니다.`);
      return;
    }
    if (memberId !== undefined && state.token) {
      try {
        const token = state.token;
        console.log("debug: token", token);
  
        const mealTypeMap = {
          breakfast: 'BREAKFAST',
          lunch: 'LUNCH',
          dinner: 'DINNER',
          snack: 'SNACK',
        };
        console.log("debug: mealTypeMap", mealTypeMap);
  
        if (!mealTypeMap[mealType]) {
          console.error(`Invalid mealType: ${mealType}`);
          return;
        }

        // `dietList` 조건 확인
        const dietExists = dietList.length > 0 && dietList.some(diet => diet.meal_type === mealTypeMap[mealType]);

        console.log("debug >>> dietExists : " + dietExists);

        if (!dietExists) {
          // 조건을 만족하지 않으면 diet 추가 및 items 추가
          const response = await axios.get(`http://localhost:8001/record/diet/insert/meal`, {
            params: { meal_type: mealTypeMap[mealType] },
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log("debug: response", response);
  
          if (meals) {
            const dietId = response.data; // 추가된 diet_id
            console.log("debug: dietId", dietId);
            await addItemsToDiet(dietId, meals[mealType]);
            alert('식단이 추가되었습니다.');
          }
        } else {
          // 조건을 만족하면 items만 추가
          if (meals && dietList) {
            const existingDiet = dietList.find(diet => diet.meal_type === mealTypeMap[mealType]);
            if (existingDiet) {
              console.log("debug: existingDiet", existingDiet);
              await addItemsToDiet(existingDiet.diet_id, meals[mealType]);
              alert('기존 식단에 항목이 추가되었습니다.');
            }
          }
        }
      } catch (error) {
        console.error('식단 추가 중 오류 발생:', error);
        alert('식단 추가에 실패했습니다.');
      }
    }
  };

  const addItemsToDiet = async (dietId: number, mealData: MealData) => {
    const token = state.token;
    console.log("debug: token", token);
  
    const { foods, amounts, nutritionalInfo } = mealData;
    console.log("debug: mealData", mealData);
  
    for (let i = 0; i < foods.length; i++) {
      const food = foods[i];
      const amount = parseInt(amounts[i], 10); // 양을 정수로 변환
      const nutrition = nutritionalInfo[i] || {
        carbs: 0,
        protein: 0,
        fat: 0,
        calories: 0,
      }; // 기본값 설정
  
      console.log("debug: food", food);
      console.log("debug: amount", amount);
      console.log("debug: nutrition", nutrition);
  
      const itemRequest = {
        item_name: food,
        quantity: amount,
        carbs: nutrition.carbs,
        protein: nutrition.protein,
        fat: nutrition.fat,
        calories: nutrition.calories,
        diet_id: dietId,
      };
  
      console.log("debug: itemRequest", itemRequest);
  
      try {
        await axios.post('http://localhost:8001/record/diet/insert/item', itemRequest, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('식품 추가 중 오류 발생:', error);
      }
    }
  };

// ... existing code ...

  useEffect(() => {
    fetchData();
    findDietAndItems();
  }, []);


  const fetchData = async () => {
    if (memberId !== undefined && state.token) {
      try {
        const token = state.token;
        console.log('Token:', token); // 토큰 확인용 로그

        const response = await axios.get('http://localhost:8001/record/diet/calculate/tdee', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true // 쿠키 포함 설정 추가
        });

        if (response.data) {
          const apiData = response.data;
          setData({
            bmr: apiData.bmr,
            tdee: apiData.tdee,
            weight: apiData.weight,
            goal: apiData.goal,
            recommendedCalories: apiData.recommendedCalories,
            recommendedProtein: apiData.recommendedProtein,
            recommendedCarb: apiData.recommendedCarb,
            recommendedFat: apiData.recommendedFat,
          });
        }
        
        console.log("debug >>> apiData : " + response.data );

      } catch (error: any) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        if (error.response?.status === 401) {
          // 토큰이 만료된 경우 로컬 스토리지의 토큰 제거
          localStorage.removeItem('token');
          // 로그인 페이지로 리다이렉트
          navigate('/login', { replace: true });
        }
      }
    } else {
      // memberId나 token이 없는 경우
      console.log('No memberId or token available');
      navigate('/login', { replace: true });
    }
  };
  
  //
  const findDietAndItems = async () => {
    if (memberId !== undefined && state.token) {

      console.log("debug >>> findDietAndItems start !!");

      try {
        const token = state.token;
        console.log('Token:', token); // 토큰 확인용 로그

        const response = await axios.get('http://localhost:8001/record/diet/get/diet', {
          params: { record_date :  selectedDate},
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true // 쿠키 포함 설정 추가
        });

        console.log("debug >>> findDietAndItems result : " + response.data);

        if (response.data !== null) {
            console.log("debug >>> dietList : " + response.data);
            setDietList(response.data);
          };
        }
        catch (error: any) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        if (error.response?.status === 401) {
          // 토큰이 만료된 경우 로컬 스토리지의 토큰 제거
          localStorage.removeItem('token');
          // 로그인 페이지로 리다이렉트
          navigate('/login', { replace: true });
        }
      }
    } else {
      // memberId나 token이 없는 경우
      console.log('No memberId or token available');
      navigate('/login', { replace: true });
    }
  };

  // fetchDietPlan 함수 수정
  const fetchDietPlan = async () => {
    if (data && state.token) {
      const requestBody = {
        calories: data.recommendedCalories,
        goal: data.goal,
        ingredients: ingredients,
        dietaryRestrictions: dietaryRestrictions.split(",").map(item => item.trim()),
        allergies: allergies.split(",").map(item => item.trim()),
        medicalConditions: medicalConditions.split(",").map(item => item.trim()),
        mealsPerDay: mealsPerDay,
        cookingPreference: cookingPreference.split(",").map(item => item.trim()),
        member_id: memberId
      };

      try {
        console.log('Request Body:', requestBody);
        console.log('Using token:', state.token);

        const response = await axios.post(
          'http://localhost:8001/diet/generate', 
          requestBody,
          {
            headers: {
              'Authorization': `Bearer ${state.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data) {
          console.log('API Response:', response.data);
          setDietPlan(response.data);
          setMeals(getMealDataFromTable(response.data)); // meals 태 업데이트
          setIsModalOpen(false);
          setIsResultModalOpen(true);
        }
      } catch (error: any) {
        console.error('식단 추천 API 호출 중 오류 발생:', error);
        
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
          
          if (error.response.status === 401 || error.response.status === 403) {
            alert('로그인이 필요하거나 세션이 만료되었습니다.');
            // 로컬 스토리지의 토큰 제거
            localStorage.removeItem('token');
            // 로그인 페이지로 리다이렉트
            navigate('/login');
            return;
          }
        }
        
        alert('식단 추천 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('필요한 정보가 부족합니다. 다시 시도해주세요.');
    }
  };

  // handleRecommend 함수 하나로 통합
  const handleRecommend = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      await fetchDietPlan(); // API 호출
      setIsModalOpen(false); // 첫 번째 모달 닫기
      setIsResultModalOpen(true); // 결과 모달 열기
    } catch (error) {
      console.error('추천 처리 중 오류 발생:', error);
      alert('식단 추천 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 식단 추천 버튼 클릭 들러 (인 화면의 버튼)
  const handleRecommendationClick = () => {
    setIsModalOpen(true); // 첫 번째 모달 열기
  };

  // 식단 항목 클릭 시 페이지 이동
  const handleRecordClick = (food: string) => {
    navigate(`./${food}`); // 해당 식단에 맞는 페이지로 이동
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 결과 모달 닫기
  const closeResultModal = () => {
    setIsResultModalOpen(false);
    setDietPlan(null); // 결과 모달을 닫을 때 식 계획 초기화
  };

  // 아침 클릭 시 상세 모달 열기
  const handleBreakfastClick = () => {
    setIsBreakfastDetailModalOpen(true);
  };

  const handleLunchClick = () => {
    setIsLunchDetailModalOpen(true);
  };

  const handleDinnerClick = () => {
    setIsDinnerDetailModalOpen(true);
  };

  const handleSnackClick = () => {
    setIsSnackDetailModalOpen(true);
  };

  return (
    <>
      <GlobalStyle /> {/* 전역 스타일 적용 */}
      <Container>
        <Header>
          <Title>오늘의 식단</Title>
          <InfoContainer>
            {data ? (
              <>
                <TotalCalories>Total : {data.tdee} kcal</TotalCalories>
                <CurrentDate>{new Date().toLocaleDateString('ko-KR')} {new Date().toLocaleString('ko-KR', { weekday: 'long' })}</CurrentDate>
              </>
            ) : (
              <TotalCalories>로딩 중...</TotalCalories>
            )}
          </InfoContainer>
        </Header>
        <GoalContainer>
        {data ? (
          <>
            <div className="nutrition-info">
            <h2>{data.weight} kg</h2>
            <p>목표: {data.goal}</p>
            <p>추천 칼로리: {data.recommendedCalories} kcal</p>
            <p>추천 단백질: {data.recommendedProtein} g</p>
            <p>추천 탄수화물: {data.recommendedCarb} g</p>
            <p>추천 지방: {data.recommendedFat} g</p>
            </div>
          </>
        ) : (
          <Goal>표 정보를 로딩 중...</Goal>
        )}
      </GoalContainer>

        {/* 메인 화면의 식단 추천 버튼 */}
        <RecommendationButton onClick={handleRecommendationClick}>
          식단 추천
        </RecommendationButton>

        <RecordList>
          {dietRecords.map((record, index) => (
            <RecordItem key={index} onClick={() => handleRecordClick(record.food)}>
              <FoodIcon>
                {record.food === "breakfast" ? "🍳" : 
                 record.food === "lunch" ? "🍚" : 
                 record.food === "dinner" ? "🥗" : 
                 record.food === "snack" ? "🍰" : ""}
              </FoodIcon>
              <FoodName>{foodLabels[record.food as keyof typeof foodLabels]}</FoodName>
            </RecordItem>
          ))}
        </RecordList>

        {/* 첫 번째 모달 - 입력 폼 */}
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <h2>식단 추천</h2>
                <CloseButton onClick={closeModal}>X</CloseButton>
              </ModalHeader>
              <ModalBody>
                <InputContainer>
                  <label>목표 칼로리:</label>
                  <Input type="number" value={data?.recommendedCalories || 0} readOnly />

                  <label>식단 목표:</label>
                  <Input type="text" value={data?.goal || ""} readOnly />
                  
                  <label>재료 (쉼표로 구분 예: 쌀, 계란, 닭가슴살):</label>
                  <Input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                  
                  <label>식 제한 (쉼표로 구분 예: 고단백질, 저탄수화물):</label>
                  <Input type="text" value={dietaryRestrictions} onChange={(e) => setDietaryRestrictions(e.target.value)} />
                  
                  <label>알레르기 (쉼표로 구분 예: 우유, 땅콩):</label>
                  <Input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                  
                  <label>의료 조건 (쉼표로 구분 예: 당뇨, 고혈압):</label>
                  <Input type="text" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} />
                  
                  <label>하루 식사 횟수:</label>
                  <Input as="select" value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)}>
                      <option value="3">3</option>
                      <option value="4">4</option>
                  </Input>
                  
                  <label>조리 난이도:</label>
                  <Input as="select" value={cookingPreference} onChange={(e) => setCookingPreference(e.target.value)}>
                      <option value="쉬움">쉬움</option>
                      <option value="보통">보통</option>
                      <option value="어려움">어려움</option>
                  </Input>

                  <RecommendButton onClick={handleRecommend} disabled={isLoading}>
                    {isLoading ? '추천받는 중...' : '추천받기'}
                  </RecommendButton>
                </InputContainer>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* 두 번째 모달 - 결과 표시 */}
        {isResultModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <h2>맞춤 식단 계획</h2>
                <CloseButton onClick={closeResultModal}>×</CloseButton>
              </ModalHeader>
              <ModalBody>
                {dietPlan ? (
                  <>
                    <DietPlanSection onBreakfastClick={handleBreakfastClick} onLunchClick={handleLunchClick} onDinnerClick={handleDinnerClick} onSnackClick={handleSnackClick} meals={meals != null ? meals :null }/>
                    <CautionSection dietPlan={dietPlan} />
                    <CloseModalButton onClick={closeResultModal}>
                      닫기
                    </CloseModalButton>
                  </>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#666'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '20px' }}>
                      🔄
                    </div>
                    <p>맞춤형 식단을 생성하고 있습니다...</p>
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}



        {/* 아침 상세 달 */}
        {isBreakfastDetailModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <h2>아침 상세 정보</h2>
                <CloseButton onClick={() => setIsBreakfastDetailModalOpen(false)}>X</CloseButton>
              </ModalHeader>
              <ModalBody>
                {meals && (
                  <div>
                    <h3>아침 식사 계획</h3>
                    <p>음식: {meals.breakfast.foods.join(', ')}</p>
                    <p>양: {meals.breakfast.amounts.join(', ')}</p>
                    <StyledButton onClick={() => handleAddMeal('breakfast')}>식단 추가</StyledButton>
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* 점심 상세 모달 */}
        {isLunchDetailModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <h2>점심 상세 정보</h2>
                <CloseButton onClick={() => setIsLunchDetailModalOpen(false)}>X</CloseButton>
              </ModalHeader>
              <ModalBody>
                {meals && (
                  <div>
                    <h3>점심 식사 계획</h3>
                    <p>음식: {meals.lunch.foods.join(', ')}</p>
                    <p>양: {meals.lunch.amounts.join(', ')}</p>
                    <StyledButton onClick={() => handleAddMeal('lunch')}>식단 추가</StyledButton>
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* 저녁 상세 모달 */}
        {isDinnerDetailModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <h2>저녁 상세 정보</h2>
                <CloseButton onClick={() => setIsDinnerDetailModalOpen(false)}>X</CloseButton>
              </ModalHeader>
              <ModalBody>
                {meals && (
                  <div>
                    <h3>저녁 식사 계획</h3>
                    <p>음식: {meals.dinner.foods.join(', ')}</p>
                    <p>양: {meals.dinner.amounts.join(', ')}</p>
                    <StyledButton onClick={() => handleAddMeal('dinner')}>식단 추가</StyledButton>
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* 간식 상세 모달 */}
        {isSnackDetailModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <h2>간식 상세 정보</h2>
                <CloseButton onClick={() => setIsSnackDetailModalOpen(false)}>X</CloseButton>
              </ModalHeader>
              <ModalBody>
                {meals && (
                  <div>
                    <h3>간식 계획</h3>
                    <p>음식: {meals.snack.foods.join(', ')}</p>
                    <p>양: {meals.snack.amounts.join(', ')}</p>
                    <StyledButton onClick={() => handleAddMeal('snack')}>식단 추가</StyledButton>
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </>
  );
}



export default DietPage;

// 스타일 컴포넌트 정의
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #1D2636;
  font-weight: 700;
  letter-spacing: 1px;
`;

const InfoContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalCalories = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #1D2636;
`;

const CurrentDate = styled.div`
  font-size: 16px;
  color: #666;
`;

const GoalContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #1D2636;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h2 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }

  p {
    font-size: 16px;
    margin: 5px 0;
  }

  .nutrition-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 15px;

    span {
      font-size: 16px;
      font-weight: bold;
    }
  }
`;

const Goal = styled.div`
  font-size: 18px;
`;

const RecordList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const RecordItem = styled.div`
  background: linear-gradient(135deg, #1D2636, #2C3E50); // 그라데이션 배경
  border-radius: 15px; // 더 부드러운 테두리
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease; // 부드러운 애니메이션
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // 그림자 효과

  &:hover {
    transform: translateY(-5px); // 호버 시 위로 이동
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); // 호버 시 그림자 강화
  }
`;

const FoodIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
  color: #1D2636;
`;

const FoodName = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #fff; // 텍스트 색상 유지
`;

const RecommendationButton = styled.button`
  background-color: #1D2636;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 10px;

  &:hover {
    background-color: #414d60;
    transform: translateY(-2px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff; // 모달 배경색
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); // 그림자 추가
  max-width: 500px; // 최대 너비 설정
  width: 90%; // 반응형 너비
  max-height: 80vh; // 최대 높이 설정
  overflow-y: auto; // 세로 스크롤 가능
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0; // 하단 경계선
  padding-bottom: 15px;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    color: #1D2636; // 제목 색상
  }
`;


const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
  transition: color 0.2s;

  &:hover {
    color: #333C4D;
  }
`;

const ModalBody = styled.div`
  font-size: 16px;
  color: #333; // 본문 텍스트 색상
  line-height: 1.5; // 줄 간격
  overflow-y: auto;
  padding: 0 10px;
  margin-bottom: 60px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1D2636;
  }
`;


const RecommendButton = styled.button`
  background-color: #1D2636;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #333C4D;
    transform: translateY(-2px);
  }
`;

const CloseModalButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #1D2636;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    background: #333C4D;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

const StyledButton = styled.button`
  background-color: #1D2636; // 버튼 색상
  color: white; // 텍스트 색상
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #333C4D; // hover 시 색상 변경
    transform: translateY(-2px); // hover 시 약간 위로 이동
  }
`;