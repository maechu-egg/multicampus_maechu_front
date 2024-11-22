import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components';
import { FaRegQuestionCircle } from 'react-icons/fa';
import CalendarTooltip from "./CalendarTooltip";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MonthlyRecordChartProps {
  exerciseDates: string[];
  dietDates: string[];
  currentMonth: Date;
  burnedCalories: number;
  consumedCalories: number;
}

const MonthlyRecordChart = ({ 
  exerciseDates, 
  dietDates, 
  currentMonth,
  burnedCalories,
  consumedCalories
}: MonthlyRecordChartProps): JSX.Element => {
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const today = new Date();
  const lastDay = currentMonth.getMonth() === today.getMonth() ? 
    today.getDate() : daysInMonth;

  let bothRecords = 0;
  let onlyExercise = 0;
  let onlyDiet = 0;
  let noRecords = 0;

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    const dateString = date.toISOString().split('T')[0];
    
    const hasExercise = exerciseDates.includes(dateString);
    const hasDiet = dietDates.includes(dateString);

    if (hasExercise && hasDiet) bothRecords++;
    else if (hasExercise) onlyExercise++;
    else if (hasDiet) onlyDiet++;
    else noRecords++;
  }

  const data = {
    labels: ['✌🏻', '💪🏻', '🥗', '❌'],
    datasets: [
      {
        data: [bothRecords, onlyExercise, onlyDiet, noRecords],
        backgroundColor: [
          '#333C4D',  
          '#ABC7FF',  
          '#228be6',  
          '#E8E8E8',  
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 40,
          boxHeight: 40,
          padding: 25,
          font: {
            size: 20,
            weight: 400,
          },
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / lastDay) * 100).toFixed(1);
            return `${label}: ${value}일 (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <ChartContainer>
      <ChartTitle>
        이번 달 기록 현황
        <CustomTool>
          <ToolTip>
            <ToolTipTitle> ✏️ 사용법</ToolTipTitle>
            <br/>
            <ToolTipText>
              <li>날짜를 클릭하여 페이지 이동</li>
              <li>PASS : 운동 or 식단만 기록<br/>
                  PERPECT : 둘 다 기록</li>                    
              <li>
                💪🏻 : 운동 기록<br/>
                🥗 : 식단 기록<br/>
                ✌🏻 : 모두 기록<br/>
                ❌ : 기록 없음
              </li>
            </ToolTipText>
            <hr/>
            <ToolTipTitle> ✒️ 칼로리 설명</ToolTipTitle>
            <br/>
            <ToolTipText>
              <li>
                운동 칼로리: 월간 소모 칼로리<br/>
                식단 칼로리: 월간 섭취 칼로리<br/>
                순 칼로리: 섭취 - 운동
              </li>
            </ToolTipText>
          </ToolTip>
          <span style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '18px' }}>
            <FaRegQuestionCircle />
          </span>
        </CustomTool>
      </ChartTitle>
      <ChartWrapper>
        <Pie data={data} options={options} />
      </ChartWrapper>
      
      <CaloriesSection>
        <CalorieItem color="#4A5568">
          <CalorieLabel>운동 칼로리</CalorieLabel>
          <CalorieValue>{burnedCalories.toLocaleString()} kcal</CalorieValue>
        </CalorieItem>
        <CalorieItem color="#4A5568">
          <CalorieLabel>식단 칼로리</CalorieLabel>
          <CalorieValue>{consumedCalories.toLocaleString()} kcal</CalorieValue>
        </CalorieItem>
        <CalorieItem color="#4A5568">
          <CalorieLabel>순 칼로리</CalorieLabel>
          <CalorieValue>
            {(consumedCalories - burnedCalories).toLocaleString()} kcal
          </CalorieValue>
        </CalorieItem>
      </CaloriesSection>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 350px;
  height: 620px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0.5, 0.5, 0.5, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  overflow: visible;

  @media (max-width: 1100px) {
    width: 100%;
    height: auto;
    margin: 10px auto;
  }
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  padding-bottom: 5px;
  font-size: 15px;
  font-weight: 550;
  color: black;
  border-bottom: 3px solid lightgray;
  width: 100%;
  text-align: center;

  @media (max-width: 850px) {
    font-size: 15px;
  }

  @media (max-width: 710px) {
    font-size: 13px;
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 350px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  canvas {
    max-width: 100%;
    height: 100% !important;
  }

  @media (max-width: 850px) {
    height: 300px;
    padding: 5px;
  }

  @media (max-width: 710px) {
    height: 250px;
    padding: 5px;
  }
`;

const CaloriesSection = styled.div`
  width: 100%;
  padding: 10px;
  border-top: 2px solid #f0f0f0;
`;

const CalorieItem = styled.div`
  background-color: #2D3748;
  border-radius: 12px;
  padding: 10px 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CalorieLabel = styled.span`
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: bold;
`;

const CalorieValue = styled.span`
  color: #E2E8F0;
  font-size: 0.7rem;
  font-weight: bold;
`;


const ToolTipTitle = styled.div`
  font-size: 18px;

   @media (max-width: 850px) {
    font-size: 17px;
  } 

  @media (max-width: 710px) {
    font-size: 15px;
  }
`;

const ToolTipText = styled.div`
  font-size: 15px;

  @media (max-width: 850px) {
    font-size: 14px;
  } 

  @media (max-width: 710px) {
    font-size: 12px;
  }
`;

const CustomTool = styled.div`
  position: relative;
  display: inline-block;
`;

const ToolTip = styled.div`
  visibility: hidden;
  max-width: 300px;
  min-width: 150px;
  width: 240px;
  background-color: rgba(0, 0, 0, 0.9);
  color: #fff;
  text-align: center;
  border-radius: 8px;
  padding: 8px;
  position: absolute;
  z-index: 1;
  top: 100%;
  right: 0;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  box-shadow: 0 4px 12px rgba(0.5, 0.5, 0.5, 0.5);

  ${CustomTool}:hover & {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

 @media (max-width: 880px) {
    width: 200px;
    padding: 7px;
  } 

  @media (max-width: 700px) {
    width: 150px;  // 예시로 너비를 더 줄였습니다.
    padding: 6px;  // 작은 화면에서 여백을 조정해 텍스트가 더 잘 맞도록 해줍니다.
  }
`;

export default MonthlyRecordChart;