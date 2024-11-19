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
// DietPlanSection 컴포넌트 수정
const DietPlanSection: React.FC<{  onBreakfastClick: () => void; onLunchClick: () => void; onDinnerClick: () => void; onSnackClick: () => void; meals: MealPlanData | null}> = ({ onBreakfastClick, onLunchClick, onDinnerClick, onSnackClick, meals }) => {
  console.log('DietPlanSection received:', meals); // 컴포넌트가 받은 데이터 로깅

 
  if(meals !== null) {
    // 데이터가 비어있는지 확인
    const hasData = Object.values(meals).some((meal: MealData) => 
      meal.foods.length > 0 || meal.amounts.length > 0 || meal.nutritionalInfo.length > 0
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
  } else{
    return null;
  }
};
export default DietPlanSection;

const ResultSection = styled.div`
  margin: 30px 0;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

const SectionIcon = styled.span`
  font-size: 24px;
  margin-right: 10px;
`;

const SectionTitle = styled.h3`
  padding: 20px;
  margin: 0;
  background: #1D2636;
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
  overflow-x: auto;
`;




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


const DietMealIcon = styled.span`
  font-size: 24px;
`;

const MealTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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
