import axios from "axios"; // axios import 추가
import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 import
import styled from "styled-components";

// 인터페이스 정의 추가 (파일 상단에 추가)
interface MealData {
  foods: string[];
  amounts: string[];
}

interface MealPlanData {
  breakfast: MealData;
  lunch: MealData;
  dinner: MealData;
  snack: MealData;
}

// 스타일 컴포넌트 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const InfoContainer = styled.div`
  text-align: right;
`;

const TotalCalories = styled.div`
  font-size: 16px;
`;

const CurrentDate = styled.div`
  font-size: 16px;
`;

const GoalContainer = styled.div`
  background: #e0f7fa;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Goal = styled.div`
  font-size: 16px;
`;

const RecordList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr); // 4개의 열로 변경
  }
`;

const RecordItem = styled.div`
  background: #f0f8ff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e0f7fa;
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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

const RecommendationButton = styled.button`
  background-color: #4caf50; // 버튼 색상
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

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
    background-color: #f0f8ff;
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
    breakfast: { foods: [], amounts: [] },
    lunch: { foods: [], amounts: [] },
    dinner: { foods: [], amounts: [] },
    snack: { foods: [], amounts: [] }
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
const DietPlanSection: React.FC<{ dietPlan: any }> = ({ dietPlan }) => {
  console.log('DietPlanSection received:', dietPlan); // 컴포넌트가 받은 데이터 로깅

  const getMealData = (plan: any): MealPlanData => {
    const meals: MealPlanData = {
      breakfast: { foods: [], amounts: [] },
      lunch: { foods: [], amounts: [] },
      dinner: { foods: [], amounts: [] },
      snack: { foods: [], amounts: [] }
    };

    if (plan && plan.dietPlan) {
      const lines: string[] = plan.dietPlan.split('\n');
      let isTableData = false;

      lines.forEach((line: string) => {
        // 테이블 시작 확인
        if (line.includes('| 식사') || line.includes('|------')) {
          isTableData = true;
          return;
        }

        // 테이블 데이터 처리
        if (isTableData && line.includes('|')) {
          const parts = line.split('|')
            .map(part => part.trim())
            .filter(part => part !== '');

          if (parts.length >= 3) {
            const [mealType, food, amount] = parts;

            // 식사 타입에 따라 분류 (간식 포함)
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

        // 간식 옵션 섹션 처리
        if (line.includes('간식 옵션:')) {
          let isSnackSection = true;
          let snackStarted = false;

          lines.forEach((snackLine: string) => {
            if (snackStarted && snackLine.startsWith('*') && !snackLine.includes('**')) {
              const snackOption = snackLine.replace('*', '').trim();
              if (snackOption && !snackOption.includes('열량:') && 
                  !snackOption.includes('단백질:') && 
                  !snackOption.includes('탄수화물:') && 
                  !snackOption.includes('지방:')) {
                meals.snack.foods.push(snackOption);
                meals.snack.amounts.push('선택 가능');
              }
            }
            if (line.includes('간식 옵션:')) {
              snackStarted = true;
            }
            if (snackStarted && line.includes('**') && !line.includes('간식')) {
              isSnackSection = false;
            }
          });
        }
      });

      console.log('Raw dietPlan:', plan.dietPlan);
      console.log('Parsed meals:', meals);
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
          맞춤형 단 계획
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
      case '점심 식':
        return { icon: '☀️', color: '#4CAF50', label: '점심', order: 2 };
      case '저녁식사':
      case '저녁 식사':
        return { icon: '🌙', color: '#2196F3', label: '저녁', order: 3 };
      case '간식':
        return { icon: '🍎', color: '#9C27B0', label: '간식', order: 4 };
      default:
        return { icon: '🍽️', color: '#757575', label: '식단', order: 5 };
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
            <TimelineMealCard $backgroundColor="#FF9800">
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
            <TimelineMealCard $backgroundColor="#4CAF50">
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
            <TimelineMealCard $backgroundColor="#2196F3">
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
              <TimelineMealCard $backgroundColor="#9C27B0">
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
    { food: "아침" },
    { food: "점심" },
    { food: "저녁" },
    { food: "간식" },
  ];

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
    try {
      await fetchDietPlan(); // API 호출
      setIsModalOpen(false); // 첫 번째 모달 닫기
      setIsResultModalOpen(true); // 결과 모달 열기
    } catch (error) {
      console.error('추천 처리 중 오류 발생:', error);
      alert('식단 추천 처리 중 오류가 발생했습니다.');
    }
  };

  // 식단 추천 버튼 클릭 핸들러 (인 화면의 버튼)
  const handleRecommendationClick = () => {
    setIsModalOpen(true); // 첫 번째 모달 열기
  };

  // 식단 항목 클릭 시 페이지 이동
  const handleRecordClick = (food: string) => {
    navigate(`/diet/${food}`); // 해당 식단에 맞는 페이지로 이동
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
          <RecordItem key={index} onClick={() => handleRecordClick(record.food)}>
            <FoodIcon>
              {record.food === "아침" ? "🍎" : 
               record.food === "점심" ? "🍚" : 
               record.food === "저녁" ? "🥗" : 
               record.food === "간식" ? "🍰" : ""}
            </FoodIcon>
            <FoodName>{record.food}</FoodName>
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
                
                <label>재료 (쉼표로 구분):</label>
                <Input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                
                <label>식 제한 (쉼표로 구분):</label>
                <Input type="text" value={dietaryRestrictions} onChange={(e) => setDietaryRestrictions(e.target.value)} />
                
                <label>알레르기 (쉼표로 구분):</label>
                <Input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                
                <label>의료 조건 (쉼표로 구분):</label>
                <Input type="text" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} />
                
                <label>하루 식사 횟수:</label>
                <Input type="text" value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)} />
                
                <label>조리 난이도 (쉼표 구분):</label>
                <Input type="text" value={cookingPreference} onChange={(e) => setCookingPreference(e.target.value)} />

                <RecommendButton onClick={handleRecommend}>
                  추천받기
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
              <h2>맞춤형 식단 계획</h2>
              <CloseButton onClick={closeResultModal}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              {dietPlan ? (
                <>
                  <DietPlanSection dietPlan={dietPlan} />
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
    </Container>
  );
}

export default DietPage;
