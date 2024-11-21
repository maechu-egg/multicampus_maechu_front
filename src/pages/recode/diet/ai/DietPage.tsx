import axios from "axios"; // axios import 추가
import CalendarTooltip from "components/ui/record/calendar/CalendarTooltip";
import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"; // 페이지 이동을 위한 import
import styled, { createGlobalStyle } from "styled-components";
import CautionSection from "./CautionSection";
import DietPlanSection from "./DietPlanSection";
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';


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

interface SummaryData {
	// 일일 섭취 칼로리
	consumed: {
		// 탄수화물
		carb: number,
		// 양
		quantity: number,
		// 지방 비율
		fatRatio: number,
		// 탄수화물 비율
		carbRatio: number,
		// 단백질 비율
		protein: number,
		// 칼로리
		calorie: number,
		// 지방
		fat: number,
		// 단백질 비율
		proteinRatio: number
	},
	// 소모 칼로리
	burnedCalories: number,
	// 일일 권장 칼로리(탄단지비율) 및 bmr, tdee 과 다이어트 목표
	recommended: {
		// 목표 탄수화물
		recommendedCarb: number,
		// 지방 비율
		fatRate: number,
		// 목표 칼로리
		recommendedCalories: number,
		// 다이어트 목표
		goal: string,
		// 목표 단백질
		recommendedProtein: number,
		// bmr(최소 칼로리)
		bmr: number,
		// tdee(권장 칼로리)
		tdee: number,
		// 몸무게
		weight: number,
		// 키
		height: number,
		// 탄수화물 비율
		carbRate: number,
		// 단백질 비율
		proteinRate: number,
		// 목표 지방
		recommendedFat: number
	}
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
  const [data, setData] = useState<SummaryData | null>(null);
  
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
    console.log("debug >>> handlerAddMeal start !!! ");
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
        console.log("debug: mealType", mealType);
  
        if (!mealTypeMap[mealType]) {
          console.error(`Invalid mealType: ${mealType}`);
          return;
        }

        // `dietList` 조건 확인
        const dietExists = dietList.some(diet => diet.meal_type === mealType);

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
            navigate(`/record/diet/${selectedDate}/${mealType}`);
          }
        } else {
          // 조건을 만족하면 items만 추가
          if (meals && dietList) {
            const existingDiet = dietList.find(diet => diet.meal_type === mealType);
            if (existingDiet) {
              console.log("debug: existingDiet", existingDiet);
              await addItemsToDiet(existingDiet.diet_id, meals[mealType]);
              alert('기존 식단에 항목이 추가되었습니다.');
              navigate(`/record/diet/${selectedDate}/${mealType}`);
            }
          }
        }
      } catch (error) {
        console.error('식단 추가 중 오류 발생:', error);
        alert('식단 추가에 실패했습니다.');
      }
    }
    console.log("debug >>> handlerAddMeal end !!! ");
  };

  const addItemsToDiet = async (dietId: number, mealData: MealData) => {
    const token = state.token;
    console.log("debug: token", token);
  
    const { foods, amounts, nutritionalInfo } = mealData;
    console.log("debug: mealData", mealData);
  
    console.log("debug >>> addItemsToDiet start !!! ");

    for (let i = 0; i < foods.length; i++) {
      const food = foods[i];
      const amount = amounts[i].match(/\d+g/g)
      ?.map((item: string) => parseInt(item.replace('g', ''), 10))
      .reduce((acc: number, curr: number) => acc + curr, 0) || 0;; // 양을 정수로 변환
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
      console.log("debug >>> addItemsToDiet end !!! ");
    }
  };

// ... existing code ...

  useEffect(() => {
    fetchData();
    findDiet();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchData = async () => {
    console.log("debug >>> fetchData start !!! ");

    if (memberId !== undefined && state.token) {
      try {
        const response = await axios.get('http://localhost:8001/record/summary/daily', {
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true // 쿠키 포함 설정 추가
        });

        if (response.data) {
          const apiData = response.data;
          setData(apiData);
          console.log("debug >>> apiData true !!! ");
        }

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
    console.log("debug >>> fetchData end !!! ");
  };
  
  //
  const findDiet = async () => {
    if (memberId !== undefined && state.token) {

      console.log("debug >>> findDiet start !!");

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

        if (response.data.length > 0) {
            setDietList(response.data);
            response.data.forEach((item:DietResponseDTO, index:number) => {
              console.log(`debug >>> diet item ${index + 1}:`, item);
            });    
          } else{
            console.log("debug >>> 식단 테이블이 하나도 없습니다.")
          }
          console.log("debug >>> findDiet end !!");
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
        calories: data.recommended.recommendedCalories,
        goal: data.recommended.goal,
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
      <CalendarTooltip text={
          <TooltipContent>
            <strong>식단 추천 및 기록 방법</strong>
            <TooltipText>
              <p>헤리스-베네딕트 공식을 이용해 BMR을 계산합니다.</p>
              <p>활동 강도에 따라 TDEE(권장 칼로리)를 계산합니다.</p>
              <p>사용자의 운동목표에 따른 비율을 곱하여 권장 칼로리를 결정합니다.</p>
              <p>그 값을 기준으로 식단을 추천합니다.</p>
              <GoalList>
                <li><strong>다이어트:</strong> 체중을 줄이거나 체지방을 줄이는 것을 목표로 합니다.</li>
                <li><strong>벌크업:</strong> 체지방 증가를 감수하면서 골격극 등 다른 체성분을 증가시킵니다.</li>
                <li><strong>린매스업:</strong> 체지방은 유지하면서 골격극을 증가시킵니다.</li>
              </GoalList>
            </TooltipText>
          </TooltipContent>
        }>
            <span style={{ cursor: 'pointer', fontSize: '20px' }}>
              <FaRegQuestionCircle />
            </span>
          </CalendarTooltip>
        <Header>
          <Title>오늘의 식단
          </Title>
          
          <InfoContainer>
            {data ? (
              <>
                <TotalCalories> 키 : {data.recommended.height} cm &nbsp; 몸무게 : {data.recommended.weight} kg </TotalCalories>
                <CurrentDate>{format(date, 'yyyy.MM.dd')} {format(date, 'EEEE', { locale: ko })}</CurrentDate>
                
              </>
            ) : (
              <TotalCalories>로딩 중...</TotalCalories>
            )}
          </InfoContainer>
        </Header>
        {data ? (
          <GoalContainer>
            
            <div className="weight-info">
            <h2>{data.recommended.goal}</h2>
            </div>
            <div className="goal-consumed-container">
              <div className="nutrition-info">
                <h3>목표</h3>
                <div className="info-block">
                  <div>
                    <p>권장 칼로리: {data.recommended.recommendedCalories} kcal</p>
                    <p>권장 단백질: {data.recommended.recommendedProtein} g</p>
                    <p>권장 탄수화물: {data.recommended.recommendedCarb} g</p>
                    <p>권장 지방: {data.recommended.recommendedFat} g</p>
                  </div>
                </div>
              </div>
              <div className="nutrition-info">
                <h3>섭취량</h3>
                <div className="info-block">
                  <div>
                    <p>섭취 칼로리: {data.consumed.calorie} kcal</p>
                    <p>섭취 탄수화물: {data.consumed.carb} g</p>
                    <p>섭취 단백질: {data.consumed.protein} g</p>
                    <p>섭취 지방: {data.consumed.fat} g</p>
                  </div>
                </div>
              </div>
            </div>
          </GoalContainer>) : (
          <Goal>표 정보를 로딩 중...</Goal>
        )}
        {/* 메인 화면의 식단 추천 버튼 */}
        <RecommendationButton onClick={handleRecommendationClick}>
          식단 추천
        </RecommendationButton>

        <RecordList>
          {dietRecords.map((record, index) => (
            <RecordItem key={index} onClick={() => handleRecordClick(record.food)}>
              <FoodIcon>
                {record.food === "breakfast" ? "🍳" : 
                 record.food === "lunch" ? "🥗" : 
                 record.food === "dinner" ? "🍚" : 
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
                  <Input type="number" value={data?.recommended.recommendedCalories || 0} readOnly />

                  <label>식단 목표:</label>
                  <Input type="text" value={data?.recommended.goal || ""} readOnly />
                  
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
                  <br/>
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
  align-items: flex-start;
  text-align: left;

  .weight-info {
    align-self: flex-start;
    margin-bottom: 15px;

    h2 {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }
  }

  p {
    font-size: 16px;
    margin: 5px 0;
  }

  .goal-consumed-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 20px;
  }

  .nutrition-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    h3 {
      font-size: 20px;
      margin-bottom: 10px;
    }

    .info-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
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
  max-height: 75vh; // 최대 높이 설정
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
  line-height: 1.7; // 줄 간격
  overflow-y: auto;
  padding: 0 10px;

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
const TooltipContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  padding: 15px;
  background-color: #f9f9f9; /* 밝은 회색으로 변경 */
  border-radius: 10px;
  border: none; /* 테두리 제거 */
  width: 400px; /* 고정 너비 설정 */
`;

const TooltipText = styled.div`
  margin-top: 10px;
`;

const GoalList = styled.ul`
  padding-left: 20px;
  list-style-type: disc;
  margin-top: 10px;
  line-height: 1.5;
  color: #555;
`;