import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api/axios";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import ExerciseInfo from "../../components/ui/record/ExerciseInfo";



function ExercisePage(): JSX.Element {
  const { selectedDate } = useParams<{ selectedDate: string }>();
  const { state } = useAuth();
  const token = state.token;
  const memberId = state.memberId;
  
  const [todayCalorie,setTodayCalorie] = useState<number>(0);
  const [todayTime,setTodayTime] = useState<number>(0);

  const [exerciseType, setExerciseType] = useState("");
  const [intensity, setIntensity] = useState("");
  const [duration, setDuration] = useState("");

  const navigate = useNavigate();
  
  const [exerciseData,setExerciseData] = useState([]);

  console.log("debug >>> selectedDate:", selectedDate);
  
  useEffect(() => {
    if (!token) {
      console.log("debug >>> token is null");
      navigate("/loginpage");
    }
    console.log("debug >>> token : " + token);
    console.log("debug >>> memberId : " + memberId);
    // 운동 조회
    exerciseGet(selectedDate);
  }, []);
  
  const exerciseGet = async (record_date: any) => {
    try {
      console.log("debug >>> data", record_date);
      const response = await api.get("record/exercise/get/exerday", {
        headers: { Authorization: `Bearer ${token}` },
        params: { record_date }
      });
      console.log("debug >>> exer Info : ", response.data);
      
      // 운동 정보 저장
      setExerciseData(response.data);
      
      // 일일 소모 칼로리
      const totalCalories = response.data.reduce((acc:number, exer:any) => acc + exer.calories, 0);
      setTodayCalorie(totalCalories);

      // 일일 운동 시간
      const totalTime = response.data.reduce((acc:number, exer:any) => acc + exer.duration, 0);
      setTodayTime(totalTime);
    
    } catch (error) {
      console.error("debug >>> error", error);
    }
  }

  const exerciseInsert = async () => {
    try {
      const data = {
        'exercise_type': exerciseType,
        'intensity': intensity,
        'duration': duration
      }

      const response = await api.post("record/exercise/insert/type", data, { headers: { Authorization: `Bearer ${token}` } });
      console.log("debug >>> exer Insert : ", response);
      
    } catch (error) {
      console.error("debug >>> error", error);
    }
  }
  // URL의 날짜를 Date 타입으로 변환
  const getFormattedDate = () => {
    try {
      if (!selectedDate) return new Date();
      return parse(selectedDate, 'yyyy-MM-dd', new Date());
    } catch (error) {
      console.error('날짜 변환 에러:', error);
      return new Date();
    }
  };

  const date = getFormattedDate();
  
  return (
    <Container>
      <SummaryCard>
        <DateSection>
          {/* 날짜 포맷팅 */}
          <h2>{format(date, 'yyyy.MM.dd')}</h2>
          <p>{format(date, 'EEEE', { locale: ko })}</p>
        </DateSection>
        <StatsSection>
          <StatItem>
            <h3>오늘 태운 칼로리</h3>
            <p>{todayCalorie} kcal</p>
          </StatItem>
          <StatItem>
            <h3>오늘 운동한 시간</h3>
            <p>{todayTime > 60 ? `${Math.floor(todayTime / 60)} 시간 ${todayTime % 60} 분` : `${todayTime} 분`}</p>
          </StatItem>
        </StatsSection>
      </SummaryCard>
      
      <SearchBar>
        <input 
          type="text" 
          placeholder="운동 종목을 검색하세요"
        />
      </SearchBar>

      <ExerciseList>
        {exerciseData.map((exercise, index) => {
          return <ExerciseInfo key={index} exercise={exercise} />;
        })}
      </ExerciseList>
    </Container>
  );
};

const Container = styled.div`
  width: 70%;
  height: 100vh;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  font-family: 'Noto Sans KR', sans-serif;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DateSection = styled.div`
  text-align: left;
  
  h2 {
    font-size: 24px;
    margin: 0;
    font-weight: 700;
  }
  
  p {
    color: #868e96;
    margin: 5px 0 0 0;
  }
`;

const StatsSection = styled.div`
  display: flex;
  gap: 30px;
`;

const StatItem = styled.div`
  text-align: center;
  
  h3 {
    font-size: 14px;
    color: #868e96;
    margin: 0 0 5px 0;
  }
  
  p {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: #212529;
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 30px;
  
  input {
    width: 100%;
    padding: 15px 20px;
    border: none;
    border-radius: 10px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 16px;
    
    &:focus {
      outline: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
`;

const ExerciseList = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 12px;
  }
`;


export default ExercisePage;
