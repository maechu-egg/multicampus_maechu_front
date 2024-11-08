import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import styled from "styled-components";
import api from "../../services/api/axios";
import { useAuth } from "../../context/AuthContext";
import MonthlyRecordChart from "../../components/MonthlyRecordChart";
import { IoCloseOutline } from "react-icons/io5";

// 타입 정의 추가
interface ExerciseRecord {
  record_date: string;
  totalCalories: number;
}

interface DietRecord {
  record_date: string;
  totalCalories: number;
}

function RecordPage() {
  const [exerciseDates, setExerciseDates] = useState<string[]>([]);
  const [dietDates, setDietDates] = useState<string[]>([]);
  const [value, setValue] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const navigate = useNavigate();
  const { state } = useAuth();
  const token = state.token;
  const memberId = state.memberId;
  const [exerciseCalories, setExerciseCalories] = useState<Record<string, number>>({});
  const [dietCalories, setDietCalories] = useState<Record<string, number>>({});


  // 컴포넌트 마운트 시 현재 월 데이터 조회
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    fetchMonthData(value);
  }, []); // 컴포넌트 마운트 시 1회 실행

  // 현재 날짜 기준 월 데이터 조회
  const fetchMonthData = async (date: Date) => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();

    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // 운동 기록 조회
      const exerciseResponse = await api.post('record/exercise/get/month', {
        'member_id': memberId,
        'year': year,
        'month': month
      }, { headers });

      // 운동 데이터 처리
      const exerciseDatesArray: string[] = [];
      const exerciseCaloriesMap: Record<string, number> = {};
      
      exerciseResponse.data.forEach((record: ExerciseRecord) => {
        exerciseDatesArray.push(record.record_date);
        exerciseCaloriesMap[record.record_date] = record.totalCalories;
      });
      
      setExerciseDates(exerciseDatesArray);
      setExerciseCalories(exerciseCaloriesMap);

      // 식단 기록 조회
      const dietResponse = await api.post('record/diet/get/month', {
        'member_id': memberId,
        'year': year,
        'month': month
      }, { headers });

      // 식단 데이터 처리
      const dietDatesArray: string[] = [];
      const dietCaloriesMap: Record<string, number> = {};
      
      dietResponse.data.forEach((record: DietRecord) => {
        dietDatesArray.push(record.record_date);
        dietCaloriesMap[record.record_date] = record.totalCalories;
      });
      
      setDietDates(dietDatesArray);
      setDietCalories(dietCaloriesMap);

    } catch (error) {
      console.error('데이터 조회 실패:', error);
    }
  };

  // 월간 총 칼로리 계산
  const calculateMonthlyCalories = () => {
    const totalBurnedCalories = Object.values(exerciseCalories)
      .reduce((sum, calories) => sum + calories, 0);
    
    const totalConsumedCalories = Object.values(dietCalories)
      .reduce((sum, calories) => sum + calories, 0);

    return {
      burned: totalBurnedCalories,
      consumed: totalConsumedCalories
    };
  };

  // 날짜 클릭 시 모달 표시
  // 날짜 클릭 시 해당 날짜 저장
  const handleClick = (date: Date) => {
    const clickedMonth = date.getMonth();
    const currentMonth = value.getMonth();

    // 이전/다음 달 날짜 클릭 시 해당 달로 이동
    // 이전/다음 달 클릭 시 alert 표시 안되게 하기 위한 코드
    if (clickedMonth !== currentMonth) {
      setValue(date);
      return;
    }

    const today = new Date();
    // date 오차 방지
    today.setHours(0, 0, 0, 0);

    const adjustedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const formattedDate = adjustedDate.toISOString().split('T')[0];

    const adjustedToday = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    );
    const formattedToday = adjustedToday.toISOString().split('T')[0];

    const hasExercise = exerciseDates.some(record => record === formattedDate);
    const hasDiet = dietDates.some(record => record === formattedDate);

    if (adjustedDate > adjustedToday) {
      // 미래 날짜 클릭 시
      alert('미리 기록할 수 없습니다.');
      // 또는 커스텀 모달 사용:
      // setModalMessage('미래 날짜는 기록할 수 없습니다.');
      // setIsWarningModalOpen(true);
      return;
    } else if (formattedDate === formattedToday) {
      setSelectedDate(formattedDate);
      setShowModal(true);
    } else if (hasExercise || hasDiet) {
      // 기록이 있는 날짜 - 기존 모달 표시
      setSelectedDate(formattedDate);
      setShowModal(true);
    } else {
      // 기록이 없는 과거 날짜
      alert('해당 날짜에는 기록이 없습니다.');
      // 또는 커스텀 모달 사용:
      // setModalMessage('해당 날짜에는 기록이 없습니다.');
      // setIsWarningModalOpen(true);
    }
  };

  // 날짜 타일 컨텐츠 표시
  const tileContent = ({ date }: { date: Date }) => {
    
    // 날짜 조정, 서버는 UTC 시간 기준이므로 오차 발생 방지
    const adjustDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    // 날짜 형식 변경, 0000-00-00 형식으로 변경
    const dateString = adjustDate.toISOString().split('T')[0];
    // 운동 기록 여부 확인  
    const hasExercise = exerciseDates.some(record => record === dateString);
    // 식단 기록 여부 확인  
    const hasDiet = dietDates.some(record => record === dateString);
    
    let emoji = '';
    // 상태에 따른 이모지 설정
    if (hasExercise && hasDiet) emoji = '😁';  // 둘 다 있을 때
    else if (hasExercise) emoji = '😊';        // 운동만 있을 때
    else if (hasDiet) emoji = '😋';            // 식단만 있을 때
    
    return (
      <div className="date-content">
        {emoji && <span className="emoji">{emoji}</span>}
      </div>
    );
  };

  // 달력 월이 변경될 때마다 데이터 조회
  const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
    if (activeStartDate) {
      fetchMonthData(activeStartDate);
    }
  };

  return (
    <Wrapper>
      <TitleContainer>
      <h1>운동 히스토리</h1>
      </TitleContainer>
      <Container>
        <Calendar
        onChange={(value) => setValue(value as Date)}
        value={value}
        locale="en-US"
        onClickDay={handleClick}
        tileContent={tileContent}
        onActiveStartDateChange={handleActiveStartDateChange}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedDate}</h3>
            <div className="button-group">
              <button onClick={() => navigate(`/record/exercise/${selectedDate}`)}>
                🏋️‍♂️
              </button>
              <button onClick={() => navigate(`/record/diet/${selectedDate}`)}>
                🥗
              </button>
            </div>
            <div className="close-button">
              <button onClick={() => setShowModal(false)}><IoCloseOutline /></button>
            </div>
          </div>
        </div>
      )}

      <MonthlyRecordChart 
        exerciseDates={exerciseDates}
        dietDates={dietDates}
        currentMonth={value}
        burnedCalories={calculateMonthlyCalories().burned}
        consumedCalories={calculateMonthlyCalories().consumed}
      />
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 50px;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  font-family: 'Noto Sans KR', sans-serif;
`;
const TitleContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 3px 10px rgba(0.5, 0.5, 0.5, 0.5); // 그림자
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1025px;
h1 {

  margin-bottom: 2rem;
  font-size: 27px;
  font-weight: 700;
  font-family: 'Pretendard', sans-serif;
  text-align: center;
   margin: 0 auto;  // 중앙 정렬
}

 @media (max-width: 850px) {
    
    h1 {
      text-align: center;
      font-size: 24px;
    }
  }

  @media (max-width: 710px) {
    h1 {
      text-align: center;
      font-size: 20px;
    }
  }
`;

const Container = styled.div`

  // 컨테이너 스타일
  display: flex; // 플렉스 정렬
  flex-direction: row; // 가로 정렬
  justify-content: center; // 중앙 정렬
  max-width: 1100px;  // 캘린더 너비와 맞춤
  margin: 0 auto;  // 중앙 정렬

  // 모달 컨텐츠 스타일
  .modal-content {
    border: 5px solid lightgray;
    border-radius: 20px; // 둥근 모서리

    // 모달 타이틀 스타일
    h3 {
      text-align: center; // 중앙 정렬
      margin-bottom: 2rem; // 하단 여백
      font-size: 1.8rem;
      font-weight: 600;
    }
    // 모달 내 버튼 그룹 스타일
    .button-group {
      font-size: 2rem;
      display: flex; // 플렉스 정렬
      justify-content: center; // 중앙 정렬
      margin-bottom: 1rem; // 하단 여백
    }
    // 모달 내 버튼 스타일
    button {
      padding: 0.8rem 1.5rem; // 버튼 크기
      border-radius: 20px;  // 둥근 모서리
      border: none; // 테두리 제거
      background-color: white; // 배경색
      cursor: pointer; // 마우스 오버 시 효과
      transition: all 0.2s ease-in-out; // 효과 시간
      // 버튼 마우스 오버 시 효과
      &:hover {
        background-color: lightgray; // 마우스 오버 시 배경색
        transform: scale(1.1); // 마우스 오버 시 크기
      }
    }
    // 모달 내 닫기 버튼 스타일
    .close-button {
      display: flex; // 플렉스 정렬
      justify-content: center; // 중앙 정렬
    }
  }

  // 캘린더 스타일
  .react-calendar {
    width: 700px; // 캘린더 너비
    height: 670px; // 캘린더 높이
    padding: 20px; // 캘린더 내부 여백
    background-color: white; // 배경색
    box-shadow: 0 4px 12px rgba(0.5, 0.5, 0.5, 0.5); // 그림자
    border-radius: 15px; // 둥근 모서리
    
    // 캘린더 타일 스타일
    .react-calendar__tile {
      padding: 10px; // 타일 내부 여백
      background: none; // 배경색
      text-align: center; // 텍스트 중앙 정렬
      // 타일 마우스 오버 시 효과
      &:hover {
        background-color: #f0f0f0; // 마우스 오버 시 배경색
      }
    }

    // 주말 타일 스타일
    .react-calendar__month-view__days__day--weekend {
      color: #ff0000; // 주말 텍스트 색상
    }

    // 인접 월 타일 스타일
    .react-calendar__month-view__days__day--neighboringMonth {
      color: #cccccc; // 인접 월 텍스트 색상
    }

 // 태블릿 화면 스타일
  @media (max-width: 850px) {
    .react-calendar {
      width: 420px; // 캘린더 너비
      border: 0.4px solid lightgray;
      border-radius: 15px;
      .emoji {
        font-size: 3.6rem; // 텍스트 크기
      }
    }
    .react-calendar__month-view__days {
      button {
        position: relative; // 상대 위치
        display: flex; // 플렉스 정렬
        height: 90px; // 높이
        border-right: 1px solid lightgray;  // 두께 증가
        border-bottom: 1px solid lightgray; // 두께 증가
        font-size: 18px; // 텍스트 크기
        font-family: 'Pretendard', sans-serif; // 폰트
        font-weight: 400; // 텍스트 두께
        box-sizing: border-box;  // 추가
      }
    }
  }

  // 모바일 화면 스타일
  @media (max-width: 710px) {
    // 캘린더 스타일
    .react-calendar {
      width: 320px; // 캘린더 너비
      border: 0.4px solid lightgray; // 구분선 추가
      border-radius: 15px; // 둥근 모서리
      // 이모지 스타일
      .emoji {
        font-size: 2.2rem; // 텍스트 크기
      }
    }
    // 일자 타일 스타일
    .react-calendar__month-view__days {
      // 일자 타일 버튼 스타일
      button {
        position: relative; // 상대 위치
        display: flex; // 플렉스 정렬
        height: 90px; // 높이
        border-right: 1px solid lightgray;  // 두께 증가
        border-bottom: 1px solid lightgray; // 두께 증가
        font-size: 18px; // 텍스트 크기
        font-family: 'Pretendard', sans-serif; // 폰트
        font-weight: 400; // 텍스트 두께
        box-sizing: border-box;  // 추가
      }
    }
  }

  // 네비게이션 스타일
  .react-calendar__navigation {
    margin: 0; // 여백 제거
    margin-top: 5px; // 여백
    border-bottom: 1px solid gray;  // 구분선 추가
    padding-bottom: 5px;  // 구분선과의 간격
    
    // 네비게이션 버튼 스타일
    button {
      min-width: 50px; // 최소 너비
      background: none; // 배경색
      font-size: 20px; // 텍스트 크기
      }
    }
  }

  // 요일(sun, mon, tue, wed, thu, fri, sat) 타일 스타일
  .react-calendar__month-view__weekdays {
    
    font-size: 17px; // 텍스트 크기
    font-weight: 400; // 텍스트 두께
    color: gray; // 텍스트 색상
    border-bottom: 1px solid gray;  // 구분선 추가
    padding-bottom: 5px;  // 구분선과의 간격
    // 주중 타일 스타일
    div {
      height: 30px; // 높이
    }
  }

  // 날짜(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11... 31) 타일 스타일
  .react-calendar__month-view__days {
    // 날짜 타일 버튼 스타일
    button {
      position: relative; // 상대 위치
      display: flex; // 플렉스 정렬
      height: 90px; // 높이
      border-left: 0.1px solid lightgray; // 구분선 추가
      border-right: 0.1px solid lightgray; // 구분선 추가
      border-bottom: 0.1px solid lightgray; // 구분선 추가
      font-size: 16px; // 텍스트 크기
      font-family: 'Pretendard', sans-serif; // 폰트
      font-weight: 550; // 텍스트 두께
    }
    // 맨 오른쪽 하단 타일 스타일
    button:last-child {
      border-radius: 0px 0px 15px 0px;
    }
    // 맨 왼쪽 하단 타일 스타일
    button:nth-child(29) {
      border-radius: 0px 0px 0px 15px;
    }
  }

  // 현재 날짜 타일 스타일
  .react-calendar__tile--now {
    background-color: #e8e8e8 !important;
    color: blue !important;
  }

  // 날짜 타일 포커스 시 효과
  .react-calendar__tile--active {
    color: black;
  }
    
  // 인접 월 타일 스타일
  .react-calendar__month-view__days__day--neighboringMonth {
    background: #e9e9e9; // 배경색
    opacity: 0.5; // 투명도
  }

  // 캘린더 날짜 타일 스타일
  .react-calendar__tile {
    text-decoration: none; // 텍스트 장식 제거
  }

 

  // 날짜 타일 컨텐츠 스타일
  .date-content {
    position: absolute; // 절대 위치
    top: 50%;  // 중앙 정렬
    left: 50%; // 중앙 정렬
    transform: translate(-50%, -50%); // 위치 이동
    // 이모지 스타일
    .emoji {
      padding: 0 auto; // 자동 여백
      margin-left: 7px; // 왼쪽 여백
      display: flex; // 플렉스 정렬
      font-size: 3.5rem; // 텍스트 크기
    }
  }
`;


export default RecordPage;
  