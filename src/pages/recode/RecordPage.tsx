import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import styled from "styled-components";
import api from "../../services/api/axios";
import { useAuth } from "../../context/AuthContext";

function RecodePage() {
  const [exerciseDates, setExerciseDates] = useState<string[]>([]);
  const [dietDates, setDietDates] = useState<string[]>([]);
  const [value, setValue] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const navigate = useNavigate();
  const { state } = useAuth();
  const token = state.token;
  const memberId = state.memberId;


  // 컴포넌트 마운트 시 현재 월 데이터 조회
  useEffect(() => {
    console.log("debug >>> memberId", memberId);
    console.log("debug >>> token", token);
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

      // 식단 기록 조회
      const dietResponse = await api.post('record/diet/get/month', {
        'member_id': memberId,
        'year': year,
        'month': month
      }, { headers });

      // 운동 기록 데이터 저장
      setExerciseDates(exerciseResponse.data);
      // 식단 기록 데이터 저장
      setDietDates(dietResponse.data);
    } catch (error) {
      console.error('데이터 조회 실패:', error);
    }
  };

  // 날짜 클릭 시 모달 표시
  // 날짜 클릭 시 해당 날짜 저장
  const handleClick = (date: Date) => {
    // 클릭한 날짜 저장
    const selectedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    // 날짜 형식 변경, 0000-00-00 형식으로 변경
    const dateString = selectedDate.toISOString().split('T')[0]
    setSelectedDate(dateString);
    // 모달 표시
    setShowModal(true);
  }

  // 날짜 타일 컨텐츠 표시
  const tileContent = ({ date }: { date: Date }) => {
    // 날짜 형식 변경, 0000-00-00 형식으로 변경
    const formattedDate = date.toISOString().split('T')[0];
    // 운동 기록 여부 확인
    const hasExercise = exerciseDates.includes(formattedDate);
    // 식단 기록 여부 확인
    const hasDiet = dietDates.includes(formattedDate);
    
    return (
      <div className="date-content">
        <div className="record-icons">
          {hasExercise && <span className="exercise-icon">💪</span>}
          {hasDiet && <span className="diet-icon">🍽️</span>}
        </div>
        {hasExercise && hasDiet && <div className="complete-badge">✨</div>}
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
    <Container>
      <h1>운동 히스토리</h1>
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
            <h3>{selectedDate} 기록하기</h3>
            <div className="button-group">
              <button onClick={() => navigate(`/record/exercise/${selectedDate}`)}>
                운동 기록
              </button>
              <button onClick={() => navigate(`/record/diet/${selectedDate}`)}>
                식단 기록
              </button>
            </div>
            <button onClick={() => setShowModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  h1 {
    margin-bottom: 2rem;
  }

  .react-calendar {
    width: 550px;
    padding: 20px;
    background-color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 15px;

    .react-calendar__tile {
      padding: 10px;
      background: none;
      text-align: center;
      
      &:hover {
        background-color: #f0f0f0;
      }
    }

    .react-calendar__month-view__days__day--weekend {
      color: #ff0000;
    }

    .react-calendar__month-view__days__day--neighboringMonth {
      color: #cccccc;
    }

    @media (max-width: 768px) {
      width: 100%;
      max-width: 400px;
      
      .react-calendar__tile {
        padding: 5px;
        font-size: 14px;
      }
    }
  }

  .react-calendar__navigation {
    margin: 0;

    button {
      min-width: 44px;
      background: none;
      font-size: 16px;
      margin-top: 8px;
      
      &:disabled {
        background-color: #f0f0f0;
      }
      
      &:enabled:hover,
      &:enabled:focus {
        background-color: #f8f8fa;
        border-radius: 6px;
      }
    }
  }

  .react-calendar__month-view__weekdays {
    font-size: 10px;
    font-weight: 400;
    color: var(--color-dark-gray);
    div {
      height: 30px;
      border: 0.4px solid var(--color-light-gray);
      border-right: none;
    }

    div:first-child {
      border-left: none;
    }
  }

  .react-calendar__month-view__days {
    button {
      position: relative;
      display: flex;
      height: 90px;
      border-right: 0.1px solid var(--color-light-gray);
      border-bottom: 0.1px solid var(--color-light-gray);
      font-size: 18px;
      font-family: 'Pretendard', sans-serif;
      font-weight: 400;
    }

    button:last-child {
      border-radius: 0px 0px 15px 0px;
    }

    button:nth-child(29) {
      border-radius: 0px 0px 0px 15px;
    }
  }

  .react-calendar__tile--now {
    background-color: var(--color-light-gray);
    color: var(--color-black);
  }

  .react-calendar__tile--now:enabled:hover {
    background-color: #e8e8e8;
  }

  .react-calendar__tile--active {
    background: var(--color-point) !important;
    color: blue !important;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    background: #e9e9e9;
    opacity: 0.5;
  }

  .calender-date-tile {
    color: inherit;
    text-decoration: none;
  }

  .emoji {
    padding: 0 auto;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    font-size: 4.6rem;
  }

  @media (max-width: 850px) {
    .react-calendar {
      width: 420px;
      border: 0.4px solid var(--color-light-gray);
      border-radius: 15px;
      .emoji {
        font-size: 3.6rem;
      }
    }
    .react-calendar__month-view__days {
      button {
        height: 70px;
        font-size: 13px;
        font-family: 'Pretendard', sans-serif;
        font-weight: 400;
      }
    }
  }

  @media (max-width: 710px) {
    .react-calendar {
      width: 320px;
      border: 0.4px solid var(--color-light-gray);
      border-radius: 15px;
      .emoji {
        font-size: 2.2rem;
      }
    }
    .react-calendar__month-view__days {
      button {
        height: 55px;
        font-size: 10px;
        font-family: 'Pretendard', sans-serif;
        font-weight: 400;
      }
    }
  }

  .date-content {
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .record-icons {
      display: flex;
      gap: 4px;
      
      span {
        font-size: 1.2rem;
      }
    }

    .complete-badge {
      font-size: 0.8rem;
      color: gold;
    }
  }
`


export default RecodePage;
  