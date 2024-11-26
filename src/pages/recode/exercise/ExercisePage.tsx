import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api/axios";
import { useAuth } from "../../../context/AuthContext";
import styled, { createGlobalStyle } from "styled-components";
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import ExerciseInfo from "../../../components/ui/record/list/exercise/ExerciseInfo";
import ExerciseAddModal from "components/ui/record/modal/exercise/ExerciseAddModal";
import { FaRegQuestionCircle } from 'react-icons/fa';
import CalendarTooltip from "../../../components/ui/record/calendar/CalendarTooltip";

interface ExerciseDTO {
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
  // 일일 칼로리, 일일 운동 시간
  const [todayCalorie,setTodayCalorie] = useState<number>(0);
  const [todayTime,setTodayTime] = useState<number>(0);
  
  const navigate = useNavigate();
  // 운동 리스트
  const [exerciseData,setExerciseData] = useState<ExerciseDTO[]>([]);
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
      alert("로그인 페이지로 이동합니다.");
      console.log("debug >>> token is null");
      navigate("/loginpage");
      return;
    }

    // selectedDate가 정의된 경우에만 exerciseGet 호출
    if (selectedDate) {
      exerciseGet(selectedDate);
    }
  }, [token]);

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

  const exerSave = (updatedExercise: any) => {
    // 기존 데이터를 복사하여 임시 리스트 생성
    const updatedExerciseData = exerciseData.map((exercise) =>
      exercise.exercise_id === updatedExercise.exercise_id ? updatedExercise : exercise
    );
  
    // setExerciseData에 임시 리스트를 설정
    setExerciseData(updatedExerciseData);
  
    // 변경된 상태를 로깅하여 확인
    console.log("debug >>> updatedExerciseData : ", updatedExerciseData);
  
    // 임시 리스트에서 총 칼로리 및 시간 계산
    const totalCalories = updatedExerciseData.reduce((acc: number, exer: any) => acc + exer.calories, 0);
    const totalTime = updatedExerciseData.reduce((acc: number, exer: any) => acc + exer.duration, 0);
  
    // 최종 결과 상태 업데이트
    setTodayCalorie(totalCalories);
    setTodayTime(totalTime);
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
    <>
      <GlobalStyle /> {/* 전역 스타일 적용 */}
      <Container>
        <SummaryCard>
          <DateSection>
            <h2>{format(date, 'yyyy.MM.dd ')}       
              <CalendarTooltip text={
                <>
                  <ToolTipTitle>⏳ MET 란</ToolTipTitle>
                    <ToolTipText>
                      <li>
                        MET는 1분간 소비되는 단위 체중당 에너지 소비량으로 
                        1분에 3.5ml의 산소를 섭취한다는 것을 의미합니다.   
                      </li>
                      <li>
                        MET는 <a href="https://www.data.go.kr/data/15068730/fileData.do">한국건강증진개발원</a>에서 가져와 데이터 정제 후 DB에서 보관합니다.              
                      </li>
                      <li>
                        MET는 세가지 강도인 LOW, GENERAL, HIGH로 분류됩니다. 통상적으로 LOW 강도에서 3 MET 미만, GENERAL 강도에서 3~5.9MET 미만, HIGH 강도에서 6 MET 이상을 가지며, 각 강도당 1,5 배수가 일반적입니다.
                      </li>
                  </ToolTipText>
                  <hr/>
                  <ToolTipTitle>📘 MET 공식</ToolTipTitle>
                    <ToolTipText>
                      <li>1 * (3.5ml * kg * min)</li>
                      <li>= air(ml)</li>
                      <li>air(L) * 5 = kcal</li>                 
                  </ToolTipText>
                  <hr/>
                  <ToolTipTitle>📗 칼로리 계산법 </ToolTipTitle>
                    <ToolTipText>
                      <li>
                        칼로리 = (MET * 3.5 * 몸무게 * 시간(분)) / 200 
                      </li>
                  </ToolTipText>

               </>
              }>
              <span style={{ cursor: 'pointer', fontSize: '20px' }}>
                <FaRegQuestionCircle />
              </span>
            </CalendarTooltip>
          </h2>
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
            placeholder="무슨 운동을 하셨나요? "
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button onClick={() => searchTerm.length > 0 ? setIsAddModalOpen(true) : alert("운동을 입력해주세요")}>
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
            onClose={() => {
              setIsAddModalOpen(false);
              setSearchTerm(""); // 검색어 초기화
            }}
            successExerInsert={addNewExercise} // 새 운동 추가 후 연동
          ></ExerciseAddModal>
        )}
      </Container>
    </>
  );
};

export default ExercisePage;

// 스타일 정의
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #b6c0d3;
  

  @media (max-width: 768px) {
    padding: 15px;
    min-height: 700px;
  }

  @media (max-width: 425px) {
    padding: 12px;
    min-height: 650px;
  }

  @media (max-width: 375px) {
    padding: 10px;
    min-height: 600px;
  }

  @media (max-width: 320px) {
    padding: 8px;
    min-height: 550px;
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    padding: 18px;
    margin-bottom: 25px;
  }

  @media (max-width: 425px) {
    padding: 16px;
    margin-bottom: 22px;
  }

  @media (max-width: 375px) {
    padding: 15px;
    margin-bottom: 20px;
  }

  @media (max-width: 320px) {
    padding: 12px;
    margin-bottom: 18px;
  }
`;

const DateSection = styled.div`
  text-align: left;
  
  h2 {
    font-size: 24px;
    margin: 0;
    font-weight: 700;

    @media (max-width: 768px) {
      font-size: 22px;
    }

    @media (max-width: 425px) {
      font-size: 21px;
    }

    @media (max-width: 375px) {
      font-size: 20px;
    }

    @media (max-width: 320px) {
      font-size: 18px;
    }
  }
  
  p {
    color: #868e96;
    margin: 5px 0 0 0;

    @media (max-width: 768px) {
      font-size: 13px;
    }

    @media (max-width: 425px) {
      font-size: 12.5px;
    }

    @media (max-width: 375px) {
      font-size: 12px;
    }

    @media (max-width: 320px) {
      font-size: 11px;
    }
  }
`;

const StatsSection = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 425px) {
    gap: 18px;
  }

  @media (max-width: 375px) {
    gap: 15px;
  }

  @media (max-width: 320px) {
    gap: 12px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  h3 {
    font-size: 14px;
    color: #868e96;
    margin: 0 0 5px 0;

    @media (max-width: 768px) {
      font-size: 13px;
    }

    @media (max-width: 425px) {
      font-size: 12.5px;
    }

    @media (max-width: 375px) {
      font-size: 12px;
    }

    @media (max-width: 320px) {
      font-size: 11px;
    }
  }
  
  p {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: #212529;

    @media (max-width: 768px) {
      font-size: 18px;
    }

    @media (max-width: 425px) {
      font-size: 17px;
    }

    @media (max-width: 375px) {
      font-size: 16px;
    }

    @media (max-width: 320px) {
      font-size: 15px;
    }
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    margin-bottom: 25px;
  }

  @media (max-width: 425px) {
    margin-bottom: 22px;
  }

  @media (max-width: 375px) {
    margin-bottom: 20px;
  }

  @media (max-width: 320px) {
    margin-bottom: 18px;
  }

  input {
    width: 100%;
    padding: 15px;
    border: 1px solid #ced4da;
    border-radius: 10px;
    background: white;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #2e5987;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    @media (max-width: 768px) {
      padding: 13px;
      font-size: 15px;
    }

    @media (max-width: 425px) {
      padding: 12px;
      font-size: 14px;
    }

    @media (max-width: 375px) {
      padding: 11px;
      font-size: 13px;
    }

    @media (max-width: 320px) {
      padding: 10px;
      font-size: 12px;
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

    @media (max-width: 768px) {
      padding: 7px 15px;
      font-size: 13px;
    }

    @media (max-width: 425px) {
      padding: 6px 14px;
      font-size: 12.5px;
    }

    @media (max-width: 375px) {
      padding: 6px 14px;
      font-size: 12px;
    }

    @media (max-width: 320px) {
      padding: 5px 12px;
      font-size: 11px;
    }
  }
`;

const ExerciseList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: transparent;
  
  @media (max-width: 768px) {
    padding: 12px;
    gap: 14px;
  }

  @media (max-width: 425px) {
    padding: 10px;
    gap: 12px;
  }

  @media (max-width: 375px) {
    padding: 8px;
    gap: 10px;
  }

  @media (max-width: 320px) {
    padding: 6px;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #b6c0d3; // 전체 배경색 설정
    margin: 0; // 기본 마진 제거
    padding: 0; // 기본 패딩 제거

    @media (max-width: 768px) {
      background-color: #a5b1c2;
    }

    @media (max-width: 425px) {
      background-color: #9faab6;
    }

    @media (max-width: 375px) {
      background-color: #95a0b3;
    }

    @media (max-width: 320px) {
      background-color: #8a97a8;
    }
  }
`;

const ToolTipTitle = styled.div`
  font-size: 18px;

   @media (max-width: 768px) {
    font-size: 17px;
  } 

  @media (max-width: 425px) {
    font-size: 15px;
  }

  @media (max-width: 375px) {
    font-size: 14px;
  }

  @media (max-width: 320px) {
    font-size: 13px;
  }
`;

const ToolTipText = styled.div`
  font-size: 15px;
  text-align: left;

   @media (max-width: 768px) {
    font-size: 14px;
  } 

  @media (max-width: 425px) {
    font-size: 13px;
  }

  @media (max-width: 375px) {
    font-size: 12px;
  }

  @media (max-width: 320px) {
    font-size: 11px;
  }
`;
