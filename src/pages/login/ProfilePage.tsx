import React, { useState } from "react";
import styled from "styled-components";
import Select, { SingleValue } from "react-select";
import categoriesData from "../../assets/data/categories.json";
import regionData from "../../assets/data/region.json";
import api from "../../services/api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

  const { state } = useAuth();
  const { token } = state;

  const cities = selectedRegion ? regions[selectedRegion] : [];

  // 디버깅 코드 추가
  console.log("Selected Category Value:", selectedCategory?.value);
  console.log(
    "Subcategories for Selected Category:",
    selectedCategory?.value
      ? categoryData.subcategories[selectedCategory.value.trim()]
      : "없음"
  );

  const subOptions =
    selectedCategory &&
    categoryData.subcategories.hasOwnProperty(selectedCategory.value.trim())
      ? categoryData.subcategories[selectedCategory.value.trim()].map(
          (exercise) => ({
            label: exercise,
            value: exercise,
          })
        )
      : [];

  const categoryOptions = categoryData.categories.map((category) => ({
    label: category,
    value: category,
  }));

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const handleCategoryChange = (newValue: Option | null) => {
    setSelectedCategory(newValue);
    setSelectedExercise(null);
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

  const handleSave = async () => {
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
      profile_allergy: allergy || undefined,
      profile_goal: goal,
      profile_sport1: selectedExercises[0]?.value || "",
      profile_sport2: selectedExercises[1]?.value || undefined,
      profile_sport3: selectedExercises[2]?.value || undefined,
      profile_workout_frequency: workoutFrequency,
    };

    try {
      const response = await api.post("/profile/register", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("프로필이 성공적으로 저장되었습니다.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("프로필 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <ProfileForm>
        <Title>Profile</Title>
        <TitleContent>1분, 나에게 맞는 정보 매칭하기</TitleContent>

        <FormRow>
          <label>성별</label>
          <div className="btn-group" role="group">
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
          <StyledInput
            type="number"
            value={age || ""}
            onChange={(e) => setAge(parseInt(e.target.value, 10))}
          />
        </FormRow>

        <FormRow>
          <label>시도</label>
          <UnifiedSelect value={selectedRegion} onChange={handleRegionChange}>
            <option value="">시도를 선택하세요</option>
            {Object.keys(regionData).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </UnifiedSelect>
        </FormRow>

        <FormRow>
          <label>시군구</label>
          <UnifiedSelect
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedRegion}
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
          </UnifiedSelect>
        </FormRow>

        <FormRow>
          <label>키</label>
          <StyledInput
            type="number"
            value={height || ""}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
          />
        </FormRow>

        <FormRow>
          <label>몸무게</label>
          <StyledInput
            type="number"
            value={weight || ""}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
          />
        </FormRow>

        <FormRow>
          <label>알레르기</label>
          <StyledInput
            type="text"
            value={allergy}
            onChange={(e) => setAllergy(e.target.value)}
            placeholder="땅콩알레르기, 유제품 등"
          />
        </FormRow>

        <FormRow>
          <label>활동량</label>
          <UnifiedSelect
            value={workoutFrequency || ""}
            onChange={(e) => setWorkoutFrequency(parseInt(e.target.value, 10))}
          >
            <option value="">한가지를 선택해주세요</option>
            <option value="1">활동이 적거나 운동을 안해요...(좌식생활)</option>
            <option value="2">가벼운 활동 및 운동을 해요 (1~3일/1주)</option>
            <option value="3">보통의 활동 및 운동을 해요! (3~5일/1주)</option>
            <option value="4">적극적인 활동과 운동을 해요 (6~7일/1주)</option>
            <option value="5">매우 적극적인 활동 및 운동 (운동선수)</option>
          </UnifiedSelect>
        </FormRow>

        <FormRow>
          <label>운동목표</label>
          <UnifiedSelect value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="">한가지를 선택해주세요</option>
            <option value="다이어트">다이어트</option>
            <option value="벌크업">벌크업</option>
            <option value="린매스업">린매스업</option>
            <option value="유지">유지</option>
          </UnifiedSelect>
        </FormRow>

        <FormRow>
          <label>운동 카테고리</label>
          <UnifiedReactSelect
            options={categoryOptions}
            value={selectedCategory}
            onChange={(newValue) =>
              handleCategoryChange(newValue as Option | null)
            }
          />
        </FormRow>

        <FormRow>
          <label>운동 종목</label>
          <UnifiedReactSelect
            options={subOptions}
            value={selectedExercise}
            onChange={(newValue) =>
              handleExerciseChange(newValue as Option | null)
            }
            isDisabled={!selectedCategory}
          />
        </FormRow>

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

        <SaveButtonContainer>
          <button
            type="button"
            className="btn btn-dark"
            onClick={handleSave}
            disabled={selectedExercises.length < 1}
          >
            저장
          </button>
        </SaveButtonContainer>
      </ProfileForm>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #b6c0d3;
`;

const ProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 550px;
  min-height: 500px;
  border: solid #ccd1d9 1px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 10%;
  margin-bottom: 100%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 1000;
  text-align: left;
  color: #333333;
  margin-bottom: 20px;
`;
const TitleContent = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
  text-align: left;
  color: #333333;
  margin-bottom: 30px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccd1d9;
  font-size: 1rem;
`;

const UnifiedSelect = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccd1d9;
  font-size: 1rem;
`;

const UnifiedReactSelect = styled(Select)`
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
  width: 100%;
  margin-bottom: 15px;
  label {
    width: 30%;
  }
  > *:not(label) {
    width: 70%;
  }
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 15px;
`;

export default ProfilePage;
