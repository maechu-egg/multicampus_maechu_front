import axios from 'axios';
import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from "../../services/api/axios"
interface DietResponseDTO {
  diet_id: number;
  record_date: string;
  meal_type: string; 
  member_id: number;
}

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: #f0f8ff;
  border-radius: 10px;
  padding: 15px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
`;

const DietDetailPage = () => {
  const { selectedDate, food } = useParams<{ selectedDate: string; food: string }>(); // URL에서 날짜와 음식 가져오기
  const { state } = useAuth(); // 로그인한 사용자 정보 가져오기
  const memberId = state.memberId // 로그인한 멤버 ID 가져오기 (예시)
  const [dietData, setDietData] = useState<DietResponseDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDietData = async () => {
    if (memberId !== undefined && state.token) {
        try {
          const token = state.token;
          console.log('debug >>> token : ', token); // 토큰 확인용 로그
          console.log("debug >>> record_date : " + selectedDate);
      const response = await api.post('record/diet/get/diet', {
          meal_type: food,
          record_date: selectedDate // record_date
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      console.log('API Response:', response.data); // 응답 데이터 로그 추가
      setDietData(response.data);
    } catch (err) {
      console.error('식단 데이터를 가져오는 중 오류 발생:', err);
      setError('식단 데이터를 가져오는 데 실패했습니다.');
    }
  }
};

  useEffect(() => {
    fetchDietData();
  }, []);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>식단 세부 정보</Title>
      {dietData ? (
        dietData.map((item) => (
          <Card key={item.diet_id}>
            <h2>{item.meal_type === "breakfast" && "아침"}
                {item.meal_type === "lunch" && "점심"}
                {item.meal_type === "dinner" && "저녁"}
                {item.meal_type === "snack" && "간식"}</h2>
          </Card>
        ))
      ) : (
        <p>로딩 중...</p>
      )}
    </Container>
  );
};

export default DietDetailPage;
