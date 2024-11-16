import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api/axios";
import { useAuth } from "../../../context/AuthContext";
import styled from "styled-components";
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import ExerciseInfo from "../../../components/ui/record/list/exercise/ExerciseInfo";
import ExerciseAddModal from "components/ui/record/modal/exercise/ExerciseAddModal";

interface ExerciseInfo {
  exercise_id: number;
  exercise_type: string; 
  duration: number;
  calories: number;
  intensity: string;
  member_id: number;
  record_date: string;
  met: number;
}


function ExercisePage(): JSX.Element {
  const { selectedDate } = useParams<{ selectedDate: string }>();
  const { state } = useAuth();
  // 토근, 멤버번호
  const token = state.token;
  const memberId = state.memberId;
  // 일일 칼로리, 일일 운동 시간
  const [todayCalorie,setTodayCalorie] = useState<number>(0);
  const [todayTime,setTodayTime] = useState<number>(0);
  // Exer Insert 시 필요한 값
  const [exerciseType, setExerciseType] = useState("");
  const [intensity, setIntensity] = useState("");
  const [duration, setDuration] = useState("");
  
  const navigate = useNavigate();
  // 운동 리스트
  const [exerciseData,setExerciseData] = useState<ExerciseInfo[]>([]);
  // 모달 트리거
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 모달 오픈 상태
  // 추가할 운동
  const [searchTerm, setSearchTerm] = useState("");

  // url의 날짜 확인
  console.log("debug >>> selectedDate:", selectedDate);
  
  // 운동 리스트 가져오기
  const exerciseGet = async (record_date: string) => {
    try {
      const response = await api.get("record/exercise/get/exerday", {
        headers: { Authorization: `Bearer ${token}` },
        params: { record_date }
      });

      // 운동 데이터 업데이트
      setExerciseData(response.data);

      // 일일 소모 칼로리 및 운동 시간 계산
      const totalCalories = response.data.reduce((acc: number, exer: any) => acc + exer.calories, 0);
      const totalTime = response.data.reduce((acc: number, exer: any) => acc + exer.duration, 0);

      // 상태 업데이트
      setTodayCalorie(totalCalories);
      setTodayTime(totalTime);
    
    } catch (error) {
      console.error("debug >>> error", error);
    }
  };

  // 마운트 시 exericseGet 실행
  useEffect(() => {
    if (!token) {
      console.log("debug >>> token is null");
      navigate("/loginpage");
      return;
    }

    // selectedDate가 정의된 경우에만 exerciseGet 호출
    if (selectedDate) {
      exerciseGet(selectedDate);
    }
  }, [selectedDate, token]);

  // ExerciseAddModal을 통해 추가된 운동을 exerciseData에 반영
  const addNewExercise = (successBoolean: boolean) => {
    if (successBoolean && selectedDate) { // selectedDate가 정의된 경우에만 호출
      exerciseGet(selectedDate);
    } else {
      console.log("debug >>> exerInsert 실패");
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };  

  // EditExerciseModal을 통해 업데이트 된 운동 정보 exerciseData에 반영, 이를 통해 재렌더링하여 클라이언트에서 바로 확인 가능
  const exerSave = (updatedExercise: any) => {
    setExerciseData((exer) =>
      exer.map((exercise) =>
        exercise.exercise_id === updatedExercise.exercise_id ? updatedExercise : exercise
      )
    );

    console.log("debug >>> exerciseData : " + exerciseData);
  };
  // 삭제된 ExerciseInfo ExercisePage에 넘겨줌
  const deleteExercise = (deletedExerciseId: number) => {
    setExerciseData((prevExerciseData) => {
      const updatedExerciseData = prevExerciseData.filter((exercise) => exercise.exercise_id !== deletedExerciseId);
      
      // 칼로리 및 시간 재계산
      const totalCalories = updatedExerciseData.reduce((acc: number, exer: any) => acc + exer.calories, 0);
      const totalTime = updatedExerciseData.reduce((acc: number, exer: any) => acc + exer.duration, 0);

      // 상태 업데이트
      setTodayCalorie(totalCalories);
      setTodayTime(totalTime);

      return updatedExerciseData; // 업데이트된 운동 데이터 반환
    });
  };

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
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <button onClick={() => setIsAddModalOpen(searchTerm.length > 0)}>
          검색
        </button>
      </SearchBar>
      <ExerciseList>
        {Array.isArray(exerciseData) && exerciseData.map((exercise, index) => (
          <ExerciseInfo
            key={index}
            exercise={exercise}
            receiveUpdatedExer={exerSave}
            receiveDeletedExer={deleteExercise}
          />
        ))}
      </ExerciseList>
      {isAddModalOpen && (
        <ExerciseAddModal
          searchTerm={searchTerm}
          onClose={() => setIsAddModalOpen(false)}
          successExerInsert={addNewExercise} // 새 운동 추가 후 연동
      ></ExerciseAddModal>)}     
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: transparent;
  font-family: 'Noto Sans KR', sans-serif;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
    font-size: 18px;
    color: #333C4D;
    margin: 0 0 5px 0;
  }
  
  p {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: #333C4D;
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 30px;

  input {
    width: 100%;
    padding: 15px;
    border: 1px solid #ced4da;
    border-radius: 10px;
    background: white;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }

  button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    padding: 8px 16px;
    background: #1D2636;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
    
    &:hover {
      background: #333C4D;
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
  background-color: transparent;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 12px;
  }
`;


export default ExercisePage;