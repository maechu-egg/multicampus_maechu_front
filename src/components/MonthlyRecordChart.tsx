import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

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
    labels: ['둘 다 기록', '운동만 기록', '식단만 기록', '기록 없음'],
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
  };

  return (
    <div style={{ width: '300px', margin: 'auto' }}>
      <h3>이번 달 기록 현황</h3>
      <Pie data={data} options={options} />
    </div>
  );
};

export default MonthlyRecordChart; 