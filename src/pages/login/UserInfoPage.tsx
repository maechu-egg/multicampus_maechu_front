import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext"; // AuthContext에서 useAuth 가져오기
import api from "../../services/api/axios"; // api를 가져옵니다.

const BASE_URL = "http://localhost:8001"; // 서버의 기본 URL

const UserInfoPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState<any>(null); // 사용자 정보를 저장할 상태
  const { state } = useAuth(); // AuthContext에서 상태 가져오기
  const { token } = state; // 상태에서 token 가져오기

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log("사용할 토큰:", token); // 토큰 출력
        const response = await api.get("/user/info", {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
          },
        });

        console.log("사용자 정보 응답:", response.data); // 응답 데이터 콘솔 출력
        setUserInfo(response.data); // 사용자 정보 상태 업데이트
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error);
      }
    };

    fetchUserInfo(); // 사용자 정보 조회 함수 호출
  }, [token]);

  // 이미지 src를 콘솔에 출력
  useEffect(() => {
    if (userInfo) {
      console.log("이미지 URL:", `${BASE_URL}${userInfo.memberImg}`); // 이미지 URL 콘솔 출력
    }
  }, [userInfo]);

  return (
    <Container>
      {userInfo ? (
        <UserInfo>
          <img src={`${BASE_URL}${userInfo.memberImg}`} alt="Profile" />
          <h2>{userInfo.nickname}</h2>
          <p>Email: {userInfo.email}</p>
          <p>Phone: {userInfo.phone || "전화번호 없음"}</p>
        </UserInfo>
      ) : (
        <p>사용자 정보를 불러오는 중...</p>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh; /* 전체 화면 높이 설정 */
  display: flex;
  justify-content: center;
  align-items: center; /* 수직 중앙 정렬 */
  margin-top: 50px;
`;

const UserInfo = styled.div`
  text-align: center; /* 텍스트 중앙 정렬 */
  img {
    width: 150px; /* 프로필 이미지 크기 설정 */
    height: 150px;
    border-radius: 50%; /* 원형 이미지 */
    object-fit: cover; /* 이미지 비율 유지 */
  }
`;

export default UserInfoPage;
