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
}: MonthlyRecordChartProps) => {
  // 현재 월의 전체 날짜 수 구하기

  console.log("debug >>> exerciseDates", exerciseDates);
  console.log("debug >>> dietDates", dietDates);
  console.log("debug >>> currentMonth", currentMonth);
  console.log("debug >>> burnedCalories", burnedCalories);
  console.log("debug >>> consumedCalories", consumedCalories);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  // 현재 날짜까지만 계산
  const today = new Date();
  const lastDay = currentMonth.getMonth() === today.getMonth() ? 
    today.getDate() : daysInMonth;

  console.log("debug >>> lastDay", lastDay);

  // 각 카테고리 날짜 수 계산
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

  console.log("debug >>> bothRecords", bothRecords);
  console.log("debug >>> onlyExercise", onlyExercise);
  console.log("debug >>> onlyDiet", onlyDiet);
  console.log("debug >>> noRecords", noRecords);

  const data = {
    labels: ['😁', '😊', '😋', '❌'],
    datasets: [
      {
        data: [bothRecords, onlyExercise, onlyDiet, noRecords],
        backgroundColor: [
          '#36A2EB',  // 파란색 - 둘 다 기록
          '#FF6384',  // 빨간색 - 운동만
          '#FFCE56',  // 노란색 - 식단만
          '#E8E8E8',  // 회색 - 기록 없음
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
        titleFont: {
          size: 16,
          family: "'Pretendard', sans-serif",
        },
        bodyFont: {
          size: 16,
          family: "'Pretendard', sans-serif",
        }
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
          <CalorieLabel>운동 소모 칼로리</CalorieLabel>
          <CalorieValue>{burnedCalories.toLocaleString()} kcal</CalorieValue>
        </CalorieItem>
        <CalorieItem color="rgb(255,255,224)">
          <CalorieLabel>식단 섭취 칼로리</CalorieLabel>
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
  width: 300px;
  height: 670px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0.5,  0.5, 0.5, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;

  @media (max-width: 850px) {
    width: 100%;
    max-width: 170px;
    height: 700px;
    margin-left: 20px;
  }

  @media (max-width: 710px) {
    width: 100%;
    max-width: 140px;
    height: 650px;
    margin-left: 20px;
  }
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  padding-bottom: 5px;
  font-size: 20px;
  font-weight: 700;
  color: black;
  border-bottom: 3px solid lightgray;
  width: 100%;
  text-align: center;
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
  margin-top: 20px;
  padding: 15px;
  border-top: 2px solid #f0f0f0;
`;

const CalorieItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 12px;
  background: ${props => props.color || '#f8f9fa'};
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
`;

const CalorieLabel = styled.span`
  font-size: 14px;
  color: #495057;
  font-weight: 500;
`;

const CalorieValue = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #212529;
`;

export default MonthlyRecordChart; 