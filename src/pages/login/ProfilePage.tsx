import React, { useState } from "react";
import styled from "styled-components";
import { AxiosError } from "axios";
import api from "../../services/api/axios";
import regionData from "../../assets/region.json";

function ProfilePage(): JSX.Element {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // 선택된 시도에 따라 해당 시군구 목록을 가져옴
  const cities = selectedRegion
    ? regionData[selectedRegion as keyof typeof regionData]
    : [];

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
    setSelectedCity(""); // 시도 변경 시 시군구 선택 초기화
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  return (
    <Container>
      <ProfileForm>
        <Title>1분, 맞춤형 정보를 드려요!</Title>
        <label>성별</label>
        <div
          className="btn-group"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio1"
            autoComplete="off"
            defaultChecked
          />
          <label className="btn btn-outline-dark" htmlFor="btnradio1">
            남성
          </label>

          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio2"
            autoComplete="off"
          />
          <label className="btn btn-outline-dark" htmlFor="btnradio2">
            여성
          </label>
        </div>

        <label>나이 </label>
        <input type="number" />

        {/* 시도 선택 */}
        <label>시도</label>
        <select
          className="form-select form-select-sm"
          aria-label="시도 선택"
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          <option value="">시도를 선택하세요</option>
          {Object.keys(regionData).map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        {/* 시군구 선택 */}
        <label>시군구</label>
        <select
          className="form-select form-select-sm"
          aria-label="시군구 선택"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedRegion} // 시도 선택 전에는 비활성화
        >
          <option value="">
            {selectedRegion ? "시군구를 선택하세요" : "시도를 먼저 선택하세요"}
          </option>
          {cities.map((city: string) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <label>키 </label>
        <input type="number" />

        <label>몸무게</label>
        <input type="number" />

        <div className="mb-3">
          <label htmlFor="formGroupExampleInput" className="form-label">
            알레르기
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput"
            placeholder="땅콩알레르기, 유제품, ,,"
          />
        </div>
        <label>활동량</label>
        <select
          className="form-select form-select-sm"
          aria-label="Small select example"
        >
          <option selected>한가지를 선택해주세요</option>
          <option value="1">활동이 적거나 운동을 안해요...(좌식생활)</option>
          <option value="2">가벼운 활동 및 운동을 해요 ^^(1~3일/1주)</option>
          <option value="3">보통의 활동 및 운동을 해요!(3~5일/1주)</option>
          <option value="4">
            운동이 좋아~ 적극적인 활동과 운동을 해요(6~7일/1주)
          </option>
          <option value="5">
            으쌰@ 매우 적극적인 활동 및 운동(운동선수거나 비슷한 경우)
          </option>
        </select>
        <label>운동목표</label>
        <select
          className="form-select form-select-sm"
          aria-label="Small select example"
        >
          <option selected>한가지를 선택해주세요</option>
          <option value="1">쏘옥 다이어트!</option>
          <option value="2">으쌰 벌크업</option>
          <option value="3">린매스업</option>
          <option value="4">유지~</option>
        </select>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <button
            type="button"
            className="btn btn-dark"
            //onClick={handleSignUp} // Sign Up 버튼 클릭 시 핸들러 호출
            //disabled={} // 버튼 비활성화 조건
          >
            저장
          </button>
        </div>
      </ProfileForm>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100vh; /* 전체 화면 높이 설정 */
  display: flex;
  justify-content: center;
  align-items: center; /* 수직 중앙 정렬 */
  padding-top: 20px; /* 위쪽 여백 추가 */
`;

const ProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 상단 정렬 */
  align-items: flex-start; /* 왼쪽 정렬 */
  width: 100%;
  max-width: 500px; /* 최대 너비 설정 */
  min-height: 500px; /* 최소 높이 설정 */
  border: solid #ccd1d9 1px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px; /* 내부 여백 추가 */
  margin-top: 30px;
`;

const Title = styled.h1`
  width: 100%;
  font-size: 2.5rem;
  font-weight: 500;
  text-align: left; /* 왼쪽 정렬 */
  margin-bottom: 20px; /* 제목 아래 여백 */
  color: #333333;
  padding: 20px;
`;

export default ProfilePage;
