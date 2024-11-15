import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import styled from "styled-components";
import api from "../../services/api/axios";
import { useAuth } from "../../context/AuthContext";
import MonthlyRecordChart from "../../components/ui/record/calendar/MonthlyRecordChart";
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

function RecordPage(): JSX.Element {
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
    console.log("debug >>> memberId : " + memberId);
    console.log("debug >>> token : " + token);
    
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
    
    let emoji = null;
    // 상태에 따른 이모지 설정
    if (hasExercise && hasDiet)  emoji = <img src="/img/record/perfect.png" alt="Pass" />;  // 둘 다 있을 때
    else if (hasExercise||hasDiet)  emoji = <img src="/img/record/pass.png" alt="Perfect" />;;    
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
    <div className="calendar-header">
      <TitleContainer>
        <h1>𝑪𝒂𝒍𝒆𝒏𝒅𝒂𝒓</h1>
      </TitleContainer>
    </div>
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
          <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="modal-content" style={{ backgroundColor: '#ffffff', borderRadius: '15px', padding: '40px', boxShadow: '0 15px 60px rgba(0, 0, 0, 0.3)', textAlign: 'center', maxWidth: '450px', width: '90%' }}>
              <h3 style={{ marginBottom: '25px', fontSize: '28px', fontWeight: '700', color: '#333', letterSpacing: '1px' }}>{selectedDate}</h3>
              <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                <button onClick={() => navigate(`/record/exercise/${selectedDate}`)} style={{ backgroundColor: '#4A5568', color: 'white', border: 'none', borderRadius: '25px', padding: '15px 25px', cursor: 'pointer', fontSize: '16px', fontWeight: '500', transition: 'background-color 0.3s, transform 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1D2636'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4A5568'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  💪🏻 운동
                </button>
                <button onClick={() => navigate(`/record/diet/${selectedDate}`)} style={{ backgroundColor: '#4A5568', color: 'white', border: 'none', borderRadius: '25px', padding: '15px 25px', cursor: 'pointer', fontSize: '16px', fontWeight: '500', transition: 'background-color 0.3s, transform 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#333C4D'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4A5568'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  🥗 식단
                </button>
              </div>
              <div className="close-button">
                <button onClick={() => setShowModal(false)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '28px', color: '#888', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#555'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
                  <IoCloseOutline />
                </button>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 0px;
  background: none;  // 배경색 제거
  border-radius: 0;  // 모서리 둥글기 제거
  border: none;      // 테두리 제거
  box-shadow: none;  // 그림자 효과 제거
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Calendar "Header" Feel for Title */
  .calendar-header {
    background-color: transparent; // 배경색을 투명하게 변경
    border-bottom: none;           // 하단 테두리 제거
    padding: 15px;
    width: 100%;
    border-top-left-radius: 0;     // 모서리 둥글기 제거
    border-top-right-radius: 0;    // 모서리 둥글기 제거
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 850px) {
    padding: 20px;
  }

  @media (max-width: 710px) {
    padding: 10px;
  }
`;

const TitleContainer = styled.div`
  background: none;
  text-align: center;

  h1 {
    margin: 0;
    font-size: 21px;
    font-weight: 550;
    font-family: 'Pretendard', sans-serif;
    color: #333333; /* Darker color for contrast */
  }

  @media (max-width: 850px) {
    h1 {
      font-size: 20px;
    }
  }

  @media (max-width: 710px) {
    h1 {
      font-size: 15px;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 30px;

  @media (max-width: 850px) {
    flex-direction: column;
    align-items: center;
  }

  .modal-content {
    border: 5px solid lightgray;
    border-radius: 20px;

    h3 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .button-group {
      font-size: 2rem;
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }

    button {
      padding: 0.8rem 1.5rem;
      border-radius: 20px;
      border: none;
      background-color: white;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: lightgray;
        transform: scale(1.1);
      }
    }

    .close-button {
      display: flex;
      justify-content: center;
    }
  }

  .react-calendar {
    width: 100%;
    min-width: 700px;
    height: 620px;
    padding: 20px;
    background-color: white;
    box-shadow: 0 4px 12px rgba(0.5, 0.5, 0.5, 0.5);
    border-radius: 15px;
  
      @media (max-width: 850px) {
        min-width: 500px;
      }
    
      @media (max-width: 710px) {
        min-width: 200px;
      }    
  }
    .react-calendar__tile {
      padding: 5px;
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

    .react-calendar__navigation {
      border-bottom: 1px solid gray;
      padding-bottom: 5px;

      button {
        border-radius: 15px;
        min-width: 50px;
        background: none;
        font-size: 17px;
      }

      @media (max-width: 850px) {
        button {
          font-size: 15px;
        }
      }
    
      @media (max-width: 710px) {
        button {
          font-size: 13px;
        }
      }
    }

    /* 세기 선택 화면의 스타일 */
  .react-calendar__century-view__decades__decade {
      padding: 20px; /* 세기 버튼의 여백을 조정 */
      font-size: 16px; /* 텍스트 크기 */
      border-radius: 10px; /* 둥근 모서리 */      
  }
  /* 년도 선택 화면의 스타일 */
  .react-calendar__decade-view__years__year {
      padding: 20px; /* 년도 버튼의 여백 */
      font-size: 16px; /* 텍스트 크기 */
      border-radius: 10px; /* 둥근 모서리 */
  }
  /* 각 월 버튼 스타일 */
  .react-calendar__year-view__months__month {
      padding: 20px; /* 여백을 늘려 버튼 크기 조절 */
      font-size: 16px; /* 폰트 크기 증가 */
      border-radius: 10px; /* 둥근 모서리 */
  }            
  /* 반응형 조정 예시 */
  @media (max-width: 850px) {
      .react-calendar__century-view__decades__decade,
      .react-calendar__decade-view__years__year,
      .react-calendar__year-view__months__month {
          font-size: 14px;
    }
  }
  @media (max-width: 710px) {
      .react-calendar__century-view__decades__decade,
      .react-calendar__decade-view__years__year,
      .react-calendar__year-view__months__month{
          font-size: 12px;
      }
  }
    
    .react-calendar__month-view__weekdays {
      font-size: 15px;
      font-weight: 400;
      color: gray;
      border-bottom: 1px solid gray;
      padding-bottom: 5px;

      div {
        height: 30px;
      }
    
      @media (max-width: 850px) {
          font-size: 13px;
      }
      @media (max-width: 710px) {
          font-size: 10px;
      }
    }

    .react-calendar__month-view__days {
      button {
        position: relative;
        display: flex;
        height: 80px;
        border-left: 0.1px solid lightgray;
        border-right: 0.1px solid lightgray;
        border-bottom: 0.1px solid lightgray;
        font-size: 13px;
        font-family: 'Pretendard', sans-serif;
        font-weight: 450;
      }

      button:last-child {
        border-radius: 0px 0px 15px 0px;
      }

      button:nth-child(29) {
        border-radius: 0px 0px 0px 15px;
      }

      @media (max-width: 850px) {
        button{
          font-size: 12px;
        }  
      }

      @media (max-width: 710px) {
        button{
          font-size: 11px;
        }
      }
    }

    .react-calendar__tile--now {
      background-color: #e8e8e8 !important;
      color: blue !important;
    }

    .react-calendar__tile--active {
      color: black;
    }

    .react-calendar__month-view__days__day--neighboringMonth {
      background: #e9e9e9;
      opacity: 0.5;
    }

    .date-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .emoji {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 7px;

        /* img 요소에 직접 스타일 적용 */
        img {
          width: 120px; /* 원하는 크기로 설정 */
          height: 120px; /* 원하는 크기로 설정 */
        }

        @media (max-width: 850px) {
          img {
            width: 120px; /* 반응형 크기 조정 */
            height: 120px;
          }
        }
        @media (max-width: 710px) {
          img {
            width: 120px;
            height: 120px;
          }
        }
      }
    }
`;

export default RecordPage;