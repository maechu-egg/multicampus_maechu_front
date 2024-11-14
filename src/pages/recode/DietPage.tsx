import axios from "axios"; // axios import 추가
import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 import
import styled from "styled-components";

// 인터페이스 정의 추가 (파일 상단에 추가)
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

interface MealPlanData {
  breakfast: MealData;
  lunch: MealData;
  dinner: MealData;
  snack: MealData;
}

// 스타일 컴포넌트 정의
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9; // 배경색 추가
  border-radius: 10px; // 모서리 둥글게
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // 그림자 추가
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333; // 제목 색상
`;

const InfoContainer = styled.div`
  margin-bottom: 20px;
`;

const TotalCalories = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #4caf50; // 칼로리 색상
`;

const CurrentDate = styled.div`
  font-size: 16px;
  color: #666; // 날짜 색상
`;

const GoalContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff; // 목표 컨테이너 배경색
  border-radius: 10px; // 모서리 둥글게
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // 그림자 추가
`;

const Goal = styled.div`
  font-size: 16px;
  color: #333; // 목표 색상
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
  background: #ffffff; // 배경색을 흰색으로 설정
  border: 1px solid #e0e0e0; // 테두리 추가
  border-radius: 10px; // 모서리 둥글게
  padding: 20px; // 패딩
  text-align: center; // 중앙 정렬
  cursor: pointer; // 커서 포인터
  transition: all 0.3s ease; // 부드러운 전환 효과
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // 그림자 효과

  &:hover {
    background-color: #f5f5f5; // 호버 시 배경색 변경
    transform: translateY(-3px); // 위로 이동 효과
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); // 호버 시 그림자 효과 증가
  }
`;

const FoodIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const FoodName = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #333;
`;

// 추천받기 버튼 스타일 추가
const RecommendationButton = styled.button`
  background-color: #4caf50; // 버튼 색상
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049; // 호버 색상
  }
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 15px;
  width: 90%;
  max-width: 700px; // Container와 동일한 max-width
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 24px;
    color: #333;
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
    color: #333;
  }
`;

const ModalBody = styled.div`
  overflow-y: auto;
  padding: 0 10px;
  margin-bottom: 60px; // CloseModalButton을 위한 여백

  // 스크롤바 스타일링
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
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

// 추천받기 버튼 스타일 추가
const RecommendButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

// 결과 테이블을 위한 새로운 스타일 컴넌트 추가
const ResultTable = styled.div`
  margin: 20px 0;
  overflow-x: auto; // 가로 스크롤 추가
  
  table {
    width: 100%;
    min-width: 600px; // 최소 테이블 너비 설정
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 12px;
    text-align: center;
  }

  th {
    background-color: #e0f7fa; // 헤더 배경색
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;

// 새로운 스타일 컴포넌트 추가
const ResultSection = styled.div`
  margin: 30px 0;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

// SectionTitle 컴포넌트 수정
const SectionIcon = styled.span`
  font-size: 24px;
  margin-right: 10px;
`;

const SectionTitle = styled.h3`
  padding: 20px;
  margin: 0;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border-radius: 15px 15px 0 0;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const SectionContent = styled.div`
  padding: 25px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0 0 15px 15px;
  overflow-x: auto; // 가로 스크롤 추가
`;

// DietPlanSection 컴포넌트 내부의 parseMealPlan 함수 수정
const parseMealPlan = (dietPlan: string): MealPlanData => {
  console.log('Parsing diet plan:', dietPlan); // 파싱할 데이터 확인
  
  const meals: MealPlanData = {
    breakfast: { foods: [], amounts: [], nutritionalInfo: [] },
    lunch: { foods: [], amounts: [], nutritionalInfo: [] },
    dinner: { foods: [], amounts: [], nutritionalInfo: [] },
    snack: { foods: [], amounts: [], nutritionalInfo: [] }
  };

  if (!dietPlan) return meals;

  try {
    // API 응답이 문자열이 아닌 객체일 경우를 처리
    const planData = typeof dietPlan === 'string' ? JSON.parse(dietPlan) : dietPlan;
    
    // 침 식사 처리
    if (planData.breakfast) {
      meals.breakfast.foods = planData.breakfast.foods || [];
      meals.breakfast.amounts = planData.breakfast.amounts || [];
    }

    // 점심 식사 처리
    if (planData.lunch) {
      meals.lunch.foods = planData.lunch.foods || [];
      meals.lunch.amounts = planData.lunch.amounts || [];
    }

    // 저녁 식사 처리
    if (planData.dinner) {
      meals.dinner.foods = planData.dinner.foods || [];
      meals.dinner.amounts = planData.dinner.amounts || [];
    }

    // 간식 처리
    if (planData.snack) {
      meals.snack.foods = planData.snack.foods || [];
      meals.snack.amounts = planData.snack.amounts || [];
    }

    console.log('Parsed meals:', meals); // 파싱된 결과 확인
    return meals;

  } catch (error) {
    console.error('Error parsing meal plan:', error);
    return meals;
  }
};

// MealPlanTable 스타일 수정
const MealPlanTable = styled.div`
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  background: white;
  margin: 20px 0;
  width: 100%;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  th {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 15px;
    font-size: 16px;
    font-weight: 500;
    text-align: left;
  }

  td {
    padding: 15px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background-color: #f5f5f5;
  }
`;

const MealTypeCell = styled.td`
  font-weight: 600;
  color: #2E7D32;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  min-width: 120px;
`;

const MealIcon = styled.span`
  font-size: 24px;
`;

const FoodCell = styled.td`
  color: #333;
  font-size: 15px;
  line-height: 1.6;
  padding: 15px;
  word-break: keep-all; // 단어 단위로 줄바꿈
  white-space: pre-wrap; // 백과 줄바꿈 유지
  
  div {
    margin: 5px 0;
  }
`;

const PortionCell = styled.td`
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  min-width: 150px;
`;

const CaloriesCell = styled.td`
  font-weight: 600;
  color: #1976D2;
  white-space: nowrap;
  min-width: 100px;
`;

// DietPlanSection 컴포넌트 수정
const DietPlanSection: React.FC<{ dietPlan: any; onBreakfastClick: () => void; onLunchClick: () => void; onDinnerClick: () => void; onSnackClick: () => void }> = ({ dietPlan, onBreakfastClick, onLunchClick, onDinnerClick, onSnackClick }) => {
  console.log('DietPlanSection received:', dietPlan); // 컴포넌트가 받은 데이터 로깅

  const getMealData = (plan: any): MealPlanData => {
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

          if (parts.length >= 3) {
            const [mealType, food, amount] = parts;

            // 식사 타입을 대문자로 변환
            const upperMealType = mealType.toUpperCase();

            if (upperMealType.includes('아침')) {
              meals.breakfast.foods.push(food);
              meals.breakfast.amounts.push(amount);
            } else if (upperMealType.includes('점심')) {
              meals.lunch.foods.push(food);
              meals.lunch.amounts.push(amount);
            } else if (upperMealType.includes('저녁')) {
              meals.dinner.foods.push(food);
              meals.dinner.amounts.push(amount);
            } else if (upperMealType.includes('간식')) {
              meals.snack.foods.push(food);
              meals.snack.amounts.push(amount);
            }
          }
        }
      });
    }

    return meals;
  };

  const meals = getMealData(dietPlan);

  // 데이터가 비어있는지 확인
  const hasData = Object.values(meals).some((meal: MealData) => 
    meal.foods.length > 0 || meal.amounts.length > 0
  );

  if (!hasData) {
    return (
      <ResultSection>
        <SectionTitle>
          <SectionIcon>🍽️</SectionIcon>
          맞춤형 식단 계획
        </SectionTitle>
        <SectionContent>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            데이터를 불러오는 중입니다...
          </div>
        </SectionContent>
      </ResultSection>
    );
  }

  // 식사 타입별 스타일 정의
  const getMealStyle = (mealType: string) => {
    switch (mealType.trim()) {
      case '아침식사':
      case '아침 식사':
        return { icon: '🌅', color: '#FF9800', label: '아침', order: 1 };
      case '점심식사':
      case '점심 식사':
        return { icon: '☀️', color: '#4CAF50', label: '점심', order: 2 };
      case '저녁식사':
      case '저녁 식사':
        return { icon: '🌙', color: '#2196F3', label: '저녁', order: 3 };
      case '간식':
        return { icon: '🍎', color: '#9C27B0', label: '간식', order: 4 };
      default:
        return { icon: '🍽️', color: '#757575', label: '식사', order: 5 };
    }
  };

  // 새로운 스타일 컴포넌트 추가
  const TimelineContainer = styled.div`
    padding: 20px;
    position: relative;
    width: 100%;
    overflow-x: hidden;
  `;

  const MealTimelineGrid = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    position: relative;
    overflow-x: auto;
    padding: 20px 0;

    &::-webkit-scrollbar {
      height: 8px;
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

    &::after {
      display: none;
    }
  `;

  const TimelineMealCard = styled.div<{ $backgroundColor: string }>`
    flex: 0 0 300px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    overflow: hidden;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: ${props => props.$backgroundColor};
    }

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
  `;

  const TimelineMealHeader = styled.div<{ $backgroundColor: string }>`
    background: ${props => props.$backgroundColor};
    padding: 15px;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  const TimelineMealTime = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  `;

  const TimelineMealContent = styled.div`
    padding: 20px;
  `;

  const TimelineFoodList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;

  const TimelineFoodItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f0f0;
      transform: translateX(5px);
    }
  `;

  return (
    <ResultSection>
      <SectionTitle>
        <SectionIcon>🍽️</SectionIcon>
        맞춤형 식단 계획
      </SectionTitle>
      <SectionContent>
        <TimelineContainer>
          <MealTimelineGrid>
            {/* 아침 식사 */}
            <TimelineMealCard $backgroundColor="#FF9800" onClick={onBreakfastClick}>
              <TimelineMealHeader $backgroundColor="#FF9800">
                <DietMealIcon>🌅</DietMealIcon>
                <MealTitle>아침</MealTitle>
              </TimelineMealHeader>
              <TimelineMealContent>
                <TimelineFoodList>
                  {meals.breakfast.foods.map((food: string, index: number) => (
                    <TimelineFoodItem key={index}>
                      <DietFoodIcon>🍳</DietFoodIcon>
                      <FoodDetails>
                        <DietFoodName>{food}</DietFoodName>
                        <FoodAmount>{meals.breakfast.amounts[index]}</FoodAmount>
                      </FoodDetails>
                    </TimelineFoodItem>
                  ))}
                </TimelineFoodList>
              </TimelineMealContent>
            </TimelineMealCard>

            {/* 점심 식사 */}
            <TimelineMealCard $backgroundColor="#4CAF50" onClick={onLunchClick}>
              <TimelineMealHeader $backgroundColor="#4CAF50">
                <DietMealIcon>☀️</DietMealIcon>
                <MealTitle>점심</MealTitle>
              </TimelineMealHeader>
              <TimelineMealContent>
                <TimelineFoodList>
                  {meals.lunch.foods.map((food: string, index: number) => (
                    <TimelineFoodItem key={index}>
                      <DietFoodIcon>🍚</DietFoodIcon>
                      <FoodDetails>
                        <DietFoodName>{food}</DietFoodName>
                        <FoodAmount>{meals.lunch.amounts[index]}</FoodAmount>
                      </FoodDetails>
                    </TimelineFoodItem>
                  ))}
                </TimelineFoodList>
              </TimelineMealContent>
            </TimelineMealCard>

            {/* 저녁 식사 */}
            <TimelineMealCard $backgroundColor="#2196F3" onClick={onDinnerClick}>
              <TimelineMealHeader $backgroundColor="#2196F3">
                <DietMealIcon>🌙</DietMealIcon>
                <MealTitle>저녁</MealTitle>
              </TimelineMealHeader>
              <TimelineMealContent>
                <TimelineFoodList>
                  {meals.dinner.foods.map((food: string, index: number) => (
                    <TimelineFoodItem key={index}>
                      <DietFoodIcon>🥗</DietFoodIcon>
                      <FoodDetails>
                        <DietFoodName>{food}</DietFoodName>
                        <FoodAmount>{meals.dinner.amounts[index]}</FoodAmount>
                      </FoodDetails>
                    </TimelineFoodItem>
                  ))}
                </TimelineFoodList>
              </TimelineMealContent>
            </TimelineMealCard>

            {/* 간식 */}
            {meals.snack.foods.length > 0 && (
              <TimelineMealCard $backgroundColor="#9C27B0" onClick={onSnackClick}>
                <TimelineMealHeader $backgroundColor="#9C27B0">
                  <DietMealIcon>🍎</DietMealIcon>
                  <MealTitle>간식</MealTitle>
                </TimelineMealHeader>
                <TimelineMealContent>
                  <TimelineFoodList>
                    {meals.snack.foods.map((food: string, index: number) => (
                      <TimelineFoodItem key={index}>
                        <DietFoodIcon>🍰</DietFoodIcon>
                        <FoodDetails>
                          <DietFoodName>{food}</DietFoodName>
                          <FoodAmount>{meals.snack.amounts[index]}</FoodAmount>
                        </FoodDetails>
                      </TimelineFoodItem>
                    ))}
                  </TimelineFoodList>
                </TimelineMealContent>
              </TimelineMealCard>
            )}
          </MealTimelineGrid>
        </TimelineContainer>
      </SectionContent>
    </ResultSection>
  );
};

// 새로운 스타일 컴포넌트 추가
const MealGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px 0;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// MealCardsContainer 스타일 수정
const MealCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 10px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// MealCard 스타일 수정
const MealCard = styled.div<{ $borderColor: string }>`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  border: 2px solid ${props => props.$borderColor};
  height: 100%;
  min-height: 200px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

const MealHeader = styled.div<{ $backgroundColor: string }>`
  background: ${props => props.$backgroundColor};
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DietMealIcon = styled.span`
  font-size: 24px;
`;

const MealTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const MealContent = styled.div`
  padding: 20px;
`;

const FoodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FoodItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: background-color 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

const DietFoodIcon = styled.span`
  font-size: 20px;
  color: #666;
`;

const FoodDetails = styled.div`
  flex: 1;
`;

const DietFoodName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
`;

const FoodAmount = styled.div`
  font-size: 14px;
  color: #666;
`;

// 닫기 버튼 스타일 추가
const CloseModalButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #4CAF50;
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
    background: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

// CautionSection 컴포넌트 추가
const CautionSection: React.FC<{ dietPlan: any }> = ({ dietPlan }) => {
  const extractCautions = (plan: any): string[] => {
    const cautions: string[] = [];
    
    if (plan && plan.dietPlan) {
      const lines: string[] = plan.dietPlan.split('\n');
      let isCautionSection = false;

      lines.forEach((line: string) => {
        if (line.includes('주의 사항')) {
          isCautionSection = true;
          return;
        }

        if (isCautionSection && line.startsWith('-')) {
          cautions.push(line.replace('-', '').trim());
        }
      });
    }

    return cautions;
  };

  const cautions = extractCautions(dietPlan);

  return (
    <ResultSection>
      <SectionTitle>
        <SectionIcon>⚠️</SectionIcon>
        주의 사항
      </SectionTitle>
      <SectionContent>
        <CautionList>
          {cautions.map((caution, index) => (
            <CautionItem key={index}>
              <CautionIcon>⚠️</CautionIcon>
              <CautionText>{caution}</CautionText>
            </CautionItem>
          ))}
        </CautionList>
      </SectionContent>
    </ResultSection>
  );
};

// 주의사항 관련 스타일 컴포넌트 추가
const CautionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CautionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  background: #fff4e5;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const CautionIcon = styled.span`
  font-size: 20px;
  color: #ff9800;
`;

const CautionText = styled.p`
  margin: 0;
  color: #333;
  line-height: 1.5;
  font-size: 15px;
`;

// getMealData 함수 정의를 DietPage 컴포넌트 외부로 이동
const getMealData = (plan: any): MealPlanData => {
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

        if (parts.length >= 3) {
          const [mealType, food, amount] = parts;

          if (mealType.includes('아침')) {
            meals.breakfast.foods.push(food);
            meals.breakfast.amounts.push(amount);
          } else if (mealType.includes('점심')) {
            meals.lunch.foods.push(food);
            meals.lunch.amounts.push(amount);
          } else if (mealType.includes('저녁')) {
            meals.dinner.foods.push(food);
            meals.dinner.amounts.push(amount);
          } else if (mealType.toLowerCase().includes('간식')) {
            meals.snack.foods.push(food);
            meals.snack.amounts.push(amount);
          }
        }
      }
    });
  }

  return meals;
};

const parseDietPlan = (dietPlan: string) => {
  const meals: MealData = {
    foods: [],
    amounts: [],
    nutritionalInfo: [],
  };

  // 식사 섹션을 정규 표현식으로 추출
  const mealSections = dietPlan.match(/(\*\*아침 식사\*\*|아침 식사|점심 식사|저녁 식사|간식)([\s\S]*?)(?=\*\*|$)/g);

  if (mealSections) {
    mealSections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim() !== '');
      lines.forEach(line => {
        const parts = line.split('|').map(part => part.trim()).filter(part => part);
        if (parts.length === 7) { // 식사 정보가 있는 경우
          const food = parts[1]; // 음식
          const amount = parts[2]; // 양
          const calories = parseInt(parts[3]); // 열량
          const protein = parseInt(parts[4]); // 단백질
          const carbs = parseInt(parts[5]); // 탄수화물
          const fat = parseInt(parts[6]); // 지방

          meals.foods.push(food);
          meals.amounts.push(amount);
          meals.nutritionalInfo.push({ calories, protein, carbs, fat });
        }
      });
    });
  }

  return meals;
};

function DietPage() {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { state } = useAuth(); // 로그인한 사용자 정보 가져오기
  const memberId = state.memberId; // user 객체에서 memberId 가져오기
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

  // ... existing code ...

const handleAddMeal = async (mealType: keyof MealPlanData) => {
  if (memberId !== undefined && state.token) {
    try {
      const token = state.token;
      const mealTypeMap = {
        breakfast: 'BREAKFAST',
        lunch: 'LUNCH',
        dinner: 'DINNER',
        snack: 'SNACK',
      };

      const response = await axios.get(`http://localhost:8001/insert/meal`, {
        params: { meal_type: mealTypeMap[mealType] },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (meals) {
        const dietId = response.data; // 추가된 diet_id
        await addItemsToDiet(dietId, meals[mealType]);
        alert('식단이 추가되었습니다.');
      }
    } catch (error) {
      console.error('식단 추가 중 오류 발생:', error);
      alert('식단 추가에 실패했습니다.');
    }
  }
};

const addItemsToDiet = async (dietId: number, mealData: MealData) => {
  const { foods, amounts, nutritionalInfo } = mealData;

  for (let i = 0; i < foods.length; i++) {
    const food = foods[i];
    const amount = parseInt(amounts[i], 10); // 양을 정수로 변환
    const nutrition = nutritionalInfo[i];

    const itemRequest = {
      item_name: food,
      quantity: amount,
      carbs: nutrition.carbs,
      protein: nutrition.protein,
      fat: nutrition.fat,
      calories: nutrition.calories,
      diet_id: dietId,
    };

    try {
      await axios.post('http://localhost:8001/insert/item', itemRequest);
    } catch (error) {
      console.error('식품 추가 중 오류 발생:', error);
    }
  }
};

// ... existing code ...

  useEffect(() => {
    const fetchData = async () => {
      if (memberId !== undefined && state.token) {
        try {
          const token = state.token;
          console.log('Token:', token); // 토큰 확인용 로그

          const response = await axios.get('http://localhost:8001/record/diet/calculate/tdee', {
            params: { member_id: memberId },
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

    fetchData();
  }, [memberId, state.token, navigate]);

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
          setMeals(getMealData(response.data)); // meals 태 업데이트
          setIsModalOpen(false);
          setIsResultModalOpen(true);
          console.log(dietPlan);
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
    try {
      await fetchDietPlan(); // API 호출
      setIsModalOpen(false); // 첫 번째 모달 닫기
      setIsResultModalOpen(true); // 결과 모달 열기
    } catch (error) {
      console.error('추천 처리 중 오류 발생:', error);
      alert('식단 추천 처리 중 오류가 발생했습니다.');
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

  // 모달 상태 추가
  const [isBreakfastDetailModalOpen, setIsBreakfastDetailModalOpen] = useState(false);
  const [isLunchDetailModalOpen, setIsLunchDetailModalOpen] = useState(false);
  const [isDinnerDetailModalOpen, setIsDinnerDetailModalOpen] = useState(false);
  const [isSnackDetailModalOpen, setIsSnackDetailModalOpen] = useState(false);

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

  const [meals, setMeals] = useState<MealPlanData | null>(null); // meals 상태 추가
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  return (
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
            <Goal>{data.weight} kg</Goal>
            <Goal>목표 : {data.goal}</Goal>
            <Goal>추천 칼로리 : {data.recommendedCalories} kcal</Goal>
            <Goal>추천 단백질 : {data.recommendedProtein} g</Goal>
            <Goal>추천 탄수화물 : {data.recommendedCarb} g</Goal>
            <Goal>추천 지방 : {data.recommendedFat} g</Goal>
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
          <RecordItem key={index} onClick={() => {
            if (record.food === "breakfast") {
              handleRecordClick(record.food);
            } else if (record.food === "lunch") {
              handleRecordClick(record.food); 
            } else if (record.food === "dinner") {
              handleRecordClick(record.food); 
            } else if (record.food === "snack") {
              handleRecordClick(record.food);
            }
          }}>
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

      {/* 두 번째 모달 - 과 표시 */}
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
                  <DietPlanSection dietPlan={dietPlan} onBreakfastClick={handleBreakfastClick} onLunchClick={handleLunchClick} onDinnerClick={handleDinnerClick} onSnackClick={handleSnackClick} />
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
                  <button onClick={() => handleAddMeal('breakfast')}>식단 추가</button>
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
                  <button onClick={() => handleAddMeal('lunch')}>식단 추가</button>
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
                  <button onClick={() => handleAddMeal('dinner')}>식단 추가</button>
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
                  <button onClick={() => handleAddMeal('snack')}>식단 추가</button>
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}



export default DietPage;

