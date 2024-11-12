import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components';

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
    labels: ['😁', '😊', '😋', '❌'],
    datasets: [
      {
        data: [bothRecords, onlyExercise, onlyDiet, noRecords],
        backgroundColor: [
          '#36A2EB',  
          '#FF6384',  
          '#FFCE56',  
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
            family: "'Pretendard', sans-serif",
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
      <ChartTitle>이번 달 기록 현황</ChartTitle>
      <ChartWrapper>
        <Pie data={data} options={options} />
      </ChartWrapper>
      
      <CaloriesSection>
        <CalorieItem color="rgba(255,99,132,0.1)">
          <CalorieLabel>운동 칼로리</CalorieLabel>
          <CalorieValue>{burnedCalories.toLocaleString()} kcal</CalorieValue>
        </CalorieItem>
        <CalorieItem color="rgb(255,255,224)">
          <CalorieLabel>식단 칼로리</CalorieLabel>
          <CalorieValue>{consumedCalories.toLocaleString()} kcal</CalorieValue>
        </CalorieItem>
        <CalorieItem color="#E5FFCC">
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

const CalorieItem = styled.div<{ color: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin: 10px;
  padding: 16px;
  background: ${props => props.color || '#f8f9fa'};
  border-radius: 8px;
`;

const CalorieLabel = styled.span`
  font-size: 11.5px;
  color: #495057;
  font-weight: 550;

  @media (max-width: 850px) {
    font-size: 13px;
  }  

  @media (max-width: 710px) {
    font-size: 12px;
  }
`;

const CalorieValue = styled.span`
  font-size: 12px;
  font-weight: 550;
  color: #212529;

  @media (max-width: 850px) {
    font-size: 13px;
  }

  @media (max-width: 710px) {
    font-size: 12px;
  }
`;

export default MonthlyRecordChart;