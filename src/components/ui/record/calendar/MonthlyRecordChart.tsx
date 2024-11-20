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
        <CalendarTooltip text={
          <>
            <strong>사용법</strong><br />
            - 달력 클릭: 날짜를 클릭하여 기록 확인.<br />
            - 💪🏻: 운동 기록<br />
            - 🥗: 식단 기록<br />
            - ✌🏻: 모두 기록<br />
            - ❌: 기록 없음<br /><br />
            
            <strong>칼로리 설명</strong><br />
            <div style={{ fontSize: '12px' }}>
              운동 칼로리: 월간 소모 칼로리<br />
              식단 칼로리: 월간 섭취 칼로리<br />
              <div style={{textAlign: 'left'}}>
                순 칼로리: 식단 - 운동 
              </div>
            </div>
          </>
        }>
          <span style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '18px' }}>
            <FaRegQuestionCircle />
          </span>
        </CalendarTooltip>
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

  @media (max-width: 850px) {
    width: 100%;
    height: 600px;
    margin: 10px auto;
  }

  @media (max-width: 710px) {
    width: 100%;
    height: auto;
    margin: 10px 0;
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

export default MonthlyRecordChart;