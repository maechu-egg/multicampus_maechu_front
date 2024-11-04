import React, { useState } from "react";
import styled from "styled-components";
import Select, { SingleValue } from "react-select";
import categoriesData from "../../assets/data/categories.json";
import regionData from "../../assets/data/region.json";
import api from "../../services/api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// 타입 정의
type RegionData = {
  [key: string]: string[];
};

type CategoryData = {
  categories: string[];
  subcategories: {
    [key: string]: string[];
  };
};

type Option = {
  label: string;
  value: string;
};

const categoryData = categoriesData as CategoryData;
const regions = regionData as RegionData;

function ProfilePage(): JSX.Element {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<SingleValue<Option>>(null);
  const [selectedExercise, setSelectedExercise] =
    useState<SingleValue<Option>>(null);
  const [selectedExercises, setSelectedExercises] = useState<Option[]>([]);
  const [gender, setGender] = useState<string>("M");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [allergy, setAllergy] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [workoutFrequency, setWorkoutFrequency] = useState<number | undefined>(
    undefined
  );
  const navigate = useNavigate();

  const { state } = useAuth(); // AuthContext에서 상태 가져오기
  const { token, memberId } = state; // 상태에서 token과 memberId 가져오기

  // 시도 선택 시 시군구 목록 가져오기
  const cities = selectedRegion ? regions[selectedRegion] : [];

  // 대분류 선택 시 소분류 목록을 필터링하여 가져오기
  const subOptions = selectedCategory
    ? categoryData.subcategories[selectedCategory.value].map((exercise) => ({
        label: exercise,
        value: exercise,
      }))
    : [];

  // 대분류 옵션 생성
  const categoryOptions = categoryData.categories.map((category) => ({
    label: category,
    value: category,
  }));

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
    setSelectedCity(""); // 시도 변경 시 시군구 초기화
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const handleCategoryChange = (newValue: Option | null) => {
    setSelectedCategory(newValue); // 대분류 선택 업데이트
    setSelectedExercise(null); // 대분류 변경 시 소분류 초기화
  };

  const handleExerciseChange = (newValue: Option | null) => {
    setSelectedExercise(newValue);
    if (
      newValue &&
      selectedExercises.length < 3 &&
      !selectedExercises.some((e) => e.value === newValue.value)
    ) {
      setSelectedExercises((prevExercises) => [...prevExercises, newValue]);
    }
  };

  const removeExercise = (exercise: Option) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.filter((e) => e.value !== exercise.value)
    );
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    // 필수 항목 체크
    const missingFields = [];

    if (!age) missingFields.push("나이");
    if (!height) missingFields.push("키");
    if (!weight) missingFields.push("몸무게");
    if (!goal) missingFields.push("운동목표");
    if (!workoutFrequency) missingFields.push("활동량");
    if (!selectedRegion) missingFields.push("시도");
    if (!selectedCity) missingFields.push("시군구");

    if (missingFields.length > 0) {
      alert(`필수 항목을 모두 입력해주세요: ${missingFields.join(", ")}`);
      return;
    }

    const profileData = {
      profile_gender: gender,
      profile_age: age,
      profile_region: `${selectedRegion}, ${selectedCity}`,
      profile_weight: weight,
      profile_height: height,
      profile_allergy: allergy || undefined, // 선택 항목
      profile_goal: goal,
      profile_sport1: selectedExercises[0]?.value || "",
      profile_sport2: selectedExercises[1]?.value || undefined,
      profile_sport3: selectedExercises[2]?.value || undefined,
      profile_workout_frequency: workoutFrequency,
    };

    // 데이터 출력 확인
    console.log("보내는 데이터 (profileData):", profileData);

    try {
      const response = await api.post("/profile/register", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("프로필이 성공적으로 저장되었습니다.");
      console.log("프로필 등록 응답 : ", response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("프로필 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <ProfileForm>
        <Title>1분, 맞춤형 정보를 드려요!</Title>

        {/* 성별 선택 */}
        <FormRow>
          <label>성별</label>
          <div
            className="btn-group"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              className="btn-check"
              name="gender"
              id="btnMale"
              autoComplete="off"
              onChange={() => setGender("M")}
              checked={gender === "M"}
            />
            <label className="btn btn-outline-dark" htmlFor="btnMale">
              남성
            </label>

            <input
              type="radio"
              className="btn-check"
              name="gender"
              id="btnFemale"
              autoComplete="off"
              onChange={() => setGender("F")}
              checked={gender === "F"}
            />
            <label className="btn btn-outline-dark" htmlFor="btnFemale">
              여성
            </label>
          </div>
        </FormRow>

        <FormRow>
          <label>나이</label>
          <input
            type="number"
            value={age || ""}
            onChange={(e) => setAge(parseInt(e.target.value, 10))}
          />
        </FormRow>

        {/* 시도 선택 */}
        <FormRow>
          <label>시도</label>
          <StyledSelect value={selectedRegion} onChange={handleRegionChange}>
            <option value="">시도를 선택하세요</option>
            {Object.keys(regionData).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </StyledSelect>
        </FormRow>

        {/* 시군구 선택 */}
        <FormRow>
          <label>시군구</label>
          <StyledSelect
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedRegion} // 시도 선택 전에는 비활성화
          >
            <option value="">
              {selectedRegion
                ? "시군구를 선택하세요"
                : "시도를 먼저 선택하세요"}
            </option>
            {cities.map((city: string) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </StyledSelect>
        </FormRow>

        <FormRow>
          <label>키</label>
          <input
            type="number"
            value={height || ""}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
          />
        </FormRow>

        <FormRow>
          <label>몸무게</label>
          <input
            type="number"
            value={weight || ""}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
          />
        </FormRow>

        <FormRow>
          <label htmlFor="formGroupExampleInput" className="form-label">
            알레르기
          </label>
          <input
            type="text"
            value={allergy}
            onChange={(e) => setAllergy(e.target.value)}
            className="form-control"
            id="formGroupExampleInput"
            placeholder="땅콩알레르기, 유제품, ,,"
          />
        </FormRow>

        <FormRow>
          <label>활동량</label>
          <StyledSelect
            value={workoutFrequency || ""}
            onChange={(e) => setWorkoutFrequency(parseInt(e.target.value, 10))}
          >
            <option value="">한가지를 선택해주세요</option>
            <option value="1">활동이 적거나 운동을 안해요...(좌식생활)</option>
            <option value="2">가벼운 활동 및 운동을 해요 ^^(1~3일/1주)</option>
            <option value="3">보통의 활동 및 운동을 해요!(3~5일/1주)</option>
            <option value="4">
              운동이 좋아~ 적극적인 활동과 운동을 해요(6~7일/1주)
            </option>
            <option value="5">
              으쌰@ 매우 적극적인 활동 및 운동(운동선수거나 비슷한 경우)
            </option>
          </StyledSelect>
        </FormRow>

        <FormRow>
          <label>운동목표</label>
          <StyledSelect value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="">한가지를 선택해주세요</option>
            <option value="다이어트">쏘옥 다이어트!</option>
            <option value="벌크업">으쌰 벌크업</option>
            <option value="린매스업">린매스업</option>
            <option value="유지">유지~</option>
          </StyledSelect>
        </FormRow>

        {/* 운동 카테고리 선택 */}
        <FormRow>
          <label>운동 카테고리</label>
          <StyledReactSelect
            options={categoryOptions}
            value={selectedCategory}
            onChange={(newValue) =>
              handleCategoryChange(newValue as Option | null)
            }
          />
        </FormRow>

        {/* 운동 종목 선택 */}
        <FormRow>
          <label>운동 종목</label>
          <StyledReactSelect
            options={subOptions}
            value={selectedExercise}
            onChange={(newValue) =>
              handleExerciseChange(newValue as Option | null)
            }
            isDisabled={!selectedCategory}
          />
        </FormRow>

        {/* 선택된 운동 종목 해시태그 형태로 표시 */}
        <SelectedExercisesContainer>
          {selectedExercises.map((exercise, index) => (
            <ExerciseTag
              key={exercise.value}
              onClick={() => removeExercise(exercise)}
            >
              {index === 0 && <Rank>1등 관심</Rank>}
              {index === 1 && <Rank>2등 관심</Rank>}
              {index === 2 && <Rank>3등 관심</Rank>}#{exercise.label} ✖
            </ExerciseTag>
          ))}
        </SelectedExercisesContainer>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <button
            type="button"
            className="btn btn-dark"
            onClick={handleSave}
            disabled={selectedExercises.length < 1}
          >
            저장
          </button>
        </div>
      </ProfileForm>
    </Container>
  );
}

// Styled-components 스타일
const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

const ProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  width: 100%;
  max-width: 500px;
  min-height: 500px;
  border: solid #ccd1d9 1px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 30px;
`;

const Title = styled.h1`
  width: 100%;
  font-size: 2.5rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
  color: #333333;
  padding: 20px;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccd1d9;
  background-color: #ffffff;
  font-size: 1rem;
`;

const StyledReactSelect = styled(Select)`
  width: 100%;
  margin-bottom: 15px;
  .react-select__control {
    border-radius: 5px;
    border: 1px solid #ccd1d9;
    box-shadow: none;
    &:hover {
      border-color: #ccd1d9;
    }
  }
`;

const Rank = styled.span`
  font-weight: bold;
  color: #ff6347;
  margin-right: 5px;
`;

const SelectedExercisesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: center;
`;

const ExerciseTag = styled.span`
  background-color: #f0f0f0;
  color: #333;
  padding: 5px 10px;
  border-radius: 20px;
  margin: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  label {
    width: 30%;
    margin-right: 10px;
    font-weight: bold;
  }
  > *:not(label) {
    width: 70%;
  }
`;

export default ProfilePage;
