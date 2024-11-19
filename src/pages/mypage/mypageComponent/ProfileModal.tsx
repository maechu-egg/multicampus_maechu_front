import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AxiosError } from "axios";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
import Select, { SingleValue } from "react-select";
import categoriesData from "../../../assets/data/categories.json";
import regionData from "../../../assets/data/region.json";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  member_id: number;
  profile_age: number;
  profile_allergy: string;
  profile_gender: string;
  profile_goal: string;
  profile_height: number;
  profile_id: number;
  profile_region: string;
  profile_sport1: string;
  profile_sport2: string;
  profile_sport3: string;
  profile_weight: number;
  profile_workout_frequency: number;
}
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

function ProfileModal({
  isOpen,
  onClose,
  profileData,
}: {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData | null;
}): JSX.Element | null {
  const { state: authState } = useAuth();
  const { token } = authState;
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
  const [profileInfo, setProfileInfo] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (profileData) {
      setProfileInfo(profileData);
      setGender(profileData.profile_gender);
      setAge(profileData.profile_age);
      setSelectedRegion(profileData.profile_region.split(", ")[0] || "");
      setSelectedCity(profileData.profile_region.split(", ")[1] || "");
      setHeight(profileData.profile_height);
      setWeight(profileData.profile_weight);
      setAllergy(profileData.profile_allergy);
      setGoal(profileData.profile_goal);
      setWorkoutFrequency(profileData.profile_workout_frequency);
      setSelectedExercises(
        [
          {
            label: profileData.profile_sport1,
            value: profileData.profile_sport1,
          },
          {
            label: profileData.profile_sport2,
            value: profileData.profile_sport2,
          },
          {
            label: profileData.profile_sport3,
            value: profileData.profile_sport3,
          },
        ].filter((sport) => sport.label !== "")
      );
    }
  }, [profileData]);

  if (!isOpen || !profileInfo) return null;

  const handleUpdate = async () => {
    try {
      const updatedProfile = {
        ...profileInfo,
        profile_gender: gender,
        profile_age: age ?? profileInfo.profile_age,
        profile_region: `${selectedRegion}, ${selectedCity}`,
        profile_height: height ?? profileInfo.profile_height,
        profile_weight: weight ?? profileInfo.profile_weight,
        profile_allergy: allergy || profileInfo.profile_allergy,
        profile_goal: goal || profileInfo.profile_goal,
        profile_workout_frequency:
          workoutFrequency ?? profileInfo.profile_workout_frequency,
        profile_sport1:
          selectedExercises[0]?.value || profileInfo.profile_sport1,
        profile_sport2:
          selectedExercises[1]?.value || profileInfo.profile_sport2,
        profile_sport3:
          selectedExercises[2]?.value || profileInfo.profile_sport3,
      };

      const response = await api.patch("/profile/update", updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("프로필 요청 patch 데이터 : ", updatedProfile);
      console.log("프로필 업데이트 응답 데이터:", response.data);
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("프로필 업데이트 오류:", error.response);
      }
    }
  };

  const cities = selectedRegion ? regions[selectedRegion] : [];
  const subOptions = selectedCategory
    ? categoryData.subcategories[selectedCategory.value].map((exercise) => ({
        label: exercise,
        value: exercise,
      }))
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

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <Title>Profile</Title>

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
            onClick={handleUpdate}
            disabled={selectedExercises.length < 1}
          >
            수정
          </button>
        </SaveButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  padding-top: 10%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  max-height: 90%;
  overflow-y: auto;

  @media (max-height: 600px) {
    max-height: 80%;
  }

  h1 {
    font-weight: 900;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 1000;
  text-align: left;
  color: #333333;
  margin-bottom: 20px;
  padding-bottom: 10px;
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
    font-weight: bold;
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

export default ProfileModal;
