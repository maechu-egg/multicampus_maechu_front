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
            <TimelineMealCard $backgroundColor="#42a5f5" onClick={onBreakfastClick}>
              <TimelineMealHeader $backgroundColor="#2196f3">
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
            <TimelineMealCard $backgroundColor="#1e88e5" onClick={onLunchClick}>
              <TimelineMealHeader $backgroundColor="#1976d2">
                <DietMealIcon>☀️</DietMealIcon>
                <MealTitle>점심</MealTitle>
              </TimelineMealHeader>
              <TimelineMealContent>
                <TimelineFoodList>
                  {meals.lunch.foods.map((food: string, index: number) => (
                    <TimelineFoodItem key={index}>
                      <DietFoodIcon>🥗</DietFoodIcon>
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
            <TimelineMealCard $backgroundColor="#1565c0" onClick={onDinnerClick}>
              <TimelineMealHeader $backgroundColor="#0d47a1">
                <DietMealIcon>🌙</DietMealIcon>
                <MealTitle>저녁</MealTitle>
              </TimelineMealHeader>
              <TimelineMealContent>
                <TimelineFoodList>
                  {meals.dinner.foods.map((food: string, index: number) => (
                    <TimelineFoodItem key={index}>
                      <DietFoodIcon>🍚</DietFoodIcon>
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
              <TimelineMealCard $backgroundColor="#0d47a1" onClick={onSnackClick}>
                <TimelineMealHeader $backgroundColor="#0a3d7a">
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

  @media (max-width: 768px) {
    margin: 15px 0;
  }

  @media (max-width: 425px) {
    margin: 10px 0;
  }

  @media (max-width: 375px) {
    margin: 8px 0;
  }

  @media (max-width: 320px) {
    margin: 5px 0;
  }
`;

const SectionIcon = styled.span`
  font-size: 24px;
  margin-right: 10px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 425px) {
    font-size: 18px;
  }

  @media (max-width: 375px) {
    font-size: 16px;
  }

  @media (max-width: 320px) {
    font-size: 14px;
  }
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

  @media (max-width: 768px) {
    padding: 15px;
    font-size: 18px;
  }

  @media (max-width: 425px) {
    padding: 10px;
    font-size: 16px;
  }

  @media (max-width: 375px) {
    padding: 8px;
    font-size: 15px;
  }

  @media (max-width: 320px) {
    padding: 5px;
    font-size: 14px;
  }
`;

const SectionContent = styled.div`
  padding: 25px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0 0 15px 15px;
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 425px) {
    padding: 10px;
  }

  @media (max-width: 375px) {
    padding: 8px;
  }

  @media (max-width: 320px) {
    padding: 5px;
  }
`;

const TimelineContainer = styled.div`
  padding: 20px;
  position: relative;
  width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 425px) {
    padding: 5px;
  }

  @media (max-width: 375px) {
    padding: 4px;
  }

  @media (max-width: 320px) {
    padding: 3px;
  }
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

  @media (max-width: 768px) {
    gap: 10px;
    padding: 15px 0;
  }

  @media (max-width: 425px) {
    gap: 5px;
    padding: 10px 0;
  }

  @media (max-width: 375px) {
    gap: 4px;
    padding: 8px 0;
  }

  @media (max-width: 320px) {
    gap: 3px;
    padding: 5px 0;
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

  @media (max-width: 768px) {
    flex: 0 0 200px;
  }

  @media (max-width: 425px) {
    flex: 0 0 150px;
  }

  @media (max-width: 375px) {
    flex: 0 0 120px;
  }

  @media (max-width: 320px) {
    flex: 0 0 100px;
  }
`;

const TimelineMealHeader = styled.div<{ $backgroundColor: string }>`
  background: ${props => props.$backgroundColor};
  padding: 15px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 425px) {
    padding: 8px;
  }

  @media (max-width: 375px) {
    padding: 6px;
  }

  @media (max-width: 320px) {
    padding: 5px;
  }
`;

const TimelineMealContent = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 425px) {
    padding: 10px;
  }

  @media (max-width: 375px) {
    padding: 8px;
  }

  @media (max-width: 320px) {
    padding: 5px;
  }
`;

const TimelineFoodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 425px) {
    gap: 8px;
  }

  @media (max-width: 375px) {
    gap: 6px;
  }

  @media (max-width: 320px) {
    gap: 5px;
  }
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

  @media (max-width: 768px) {
    padding: 10px;
    gap: 8px;
  }

  @media (max-width: 425px) {
    padding: 8px;
    gap: 6px;
  }

  @media (max-width: 375px) {
    padding: 6px;
    gap: 5px;
  }

  @media (max-width: 320px) {
    padding: 5px;
    gap: 4px;
  }
`;

const DietMealIcon = styled.span`
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 425px) {
    font-size: 18px;
  }

  @media (max-width: 375px) {
    font-size: 16px;
  }

  @media (max-width: 320px) {
    font-size: 14px;
  }
`;

const MealTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 425px) {
    font-size: 14px;
  }

  @media (max-width: 375px) {
    font-size: 13px;
  }

  @media (max-width: 320px) {
    font-size: 12px;
  }
`;

const DietFoodIcon = styled.span`
  font-size: 20px;
  color: #666;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 425px) {
    font-size: 16px;
  }

  @media (max-width: 375px) {
    font-size: 14px;
  }

  @media (max-width: 320px) {
    font-size: 12px;
  }
`;

const FoodDetails = styled.div`
  flex: 1;
`;

const DietFoodName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 425px) {
    font-size: 13px;
  }

  @media (max-width: 375px) {
    font-size: 12px;
  }

  @media (max-width: 320px) {
    font-size: 11px;
  }
`;

const FoodAmount = styled.div`
  font-size: 14px;
  color: #666;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 425px) {
    font-size: 11px;
  }

  @media (max-width: 375px) {
    font-size: 10px;
  }

  @media (max-width: 320px) {
    font-size: 9px;
  }
`;

