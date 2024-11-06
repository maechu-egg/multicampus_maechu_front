import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api/axios";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";


function ExercisePage() {
  const { selectedDate } = useParams();
  const { state } = useAuth();
  const token = state.token;
  const memberId = state.memberId;

  const [exerciseType, setExerciseType] = useState("");
  const [intensity, setIntensity] = useState("");
  const [duration, setDuration] = useState("");

  const navigate = useNavigate();
  
  const [exerciseData,setExerciseData] = useState({});

  console.log("debug >>> selectedDate:", selectedDate);
  
  useEffect(() => {
    if (!token) {
      console.log("debug >>> token is null");
      navigate("/loginpage");
    }
    const data = {
      'member_id': memberId,
      'record_date': selectedDate,
    }
    fetchExerciseData(data);
  }, []);
  
  const fetchExerciseData = async (data: any) => {
    try {
      console.log("debug >>> data", data);
      const response = await api.post("record/exercise/get/exerday", data, { headers: { Authorization: `Bearer ${token}` } });
      
      console.log("debug >>> response", response);
      setExerciseData(response.data);

    } catch (error) {
      console.error("debug >>> error", error);
    }
  }

  const exerciseInsert = async () => {
    try {
      const data = {
        'exercise_type': exerciseType,
        'intensity': intensity,
        'duration': duration,
        'member_id': memberId,
      }

      const response = await api.post("record/exercise/insert/type", data, { headers: { Authorization: `Bearer ${token}` } });
      console.log("debug >>> response", response);
    } catch (error) {
      console.error("debug >>> error", error);
    }
  }
  
  return (
    <Container>
      <SummaryCard>
        <DateSection>
          <h2>{selectedDate}</h2>
          <p>금요일</p>
        </DateSection>
        <StatsSection>
          <StatItem>
            <h3>오늘 태운 칼로리</h3>
            <p>150 kcal</p>
          </StatItem>
          <StatItem>
            <h3>오늘 운동한 시간</h3>
            <p>3000 kg</p>
          </StatItem>
        </StatsSection>
      </SummaryCard>
      
      <SearchBar>
        <input 
          type="text" 
          placeholder="운동 종목을 검색하세요"
        />
      </SearchBar>
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



export default ExercisePage;
