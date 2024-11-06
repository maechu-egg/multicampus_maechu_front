import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MonthlyRecordChartProps {
  exerciseDates: string[];
  dietDates: string[];
  currentMonth: Date;
}

const MonthlyRecordChart = ({ exerciseDates, dietDates, currentMonth }: MonthlyRecordChartProps) => {
  // 현재 월의 전체 날짜 수 구하기
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  // 현재 날짜까지만 계산
  const today = new Date();
  const lastDay = currentMonth.getMonth() === today.getMonth() ? 
    today.getDate() : daysInMonth;

  // 각 카테고리 날짜 수 계산
  let bothRecords = 0;
  let onlyExercise = 0;
  let onlyDiet = 0;
  let noRecords = 0;

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
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
            size: 25,
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
    margin-left: 20px;
  }

  @media (max-width: 710px) {
    width: 100%;
    max-width: 140px;
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
  height: 450px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  canvas {
    max-width: 100%;
    height: 100% !important;
  }

  @media (max-width: 850px) {
    height: 350px;
    padding: 5px;
  }

  @media (max-width: 710px) {
    height: 300px;
    padding: 5px;
  }
`;

export default MonthlyRecordChart; 