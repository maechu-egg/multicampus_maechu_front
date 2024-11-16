import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Select, { SingleValue } from "react-select";
import categoriesData from "../../../assets/data/categories.json";
import regionData from "../../../assets/data/region.json";
import { useAuth } from "context/AuthContext";
import api from "services/api/axios";
import { AxiosError } from "axios";
// 타입 정의
type Option = {
  label: string;
  value: string;
};

type ProfileFormProps = {
  initialData?: any; // 초기 데이터를 받아서 폼에 채울 값
  onSave: (profileData: any) => void; // 저장 버튼 클릭 시 호출할 함수
};

const categoryData = categoriesData as {
  categories: string[];
  subcategories: { [key: string]: string[] };
};

const regions = regionData as { [key: string]: string[] };

function ProfileForm({ initialData, onSave }: ProfileFormProps): JSX.Element {
  const { state: authState } = useAuth();
  const { token, memberId } = authState;
  const [gender, setGender] = useState(initialData?.profile_gender || "M");
  const [age, setAge] = useState(initialData?.profile_age || "");
  const [height, setHeight] = useState(initialData?.profile_height || "");
  const [weight, setWeight] = useState(initialData?.profile_weight || "");
  const [allergy, setAllergy] = useState(initialData?.profile_allergy || "");
  const [goal, setGoal] = useState(initialData?.profile_goal || "");
  const [workoutFrequency, setWorkoutFrequency] = useState(
    initialData?.profile_workout_frequency || ""
  );
  const [selectedRegion, setSelectedRegion] = useState(
    initialData?.profile_region?.split(", ")[0] || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    initialData?.profile_region?.split(", ")[1] || ""
  );
  const [selectedCategory, setSelectedCategory] =
    useState<SingleValue<Option>>(null);
  const [selectedExercise, setSelectedExercise] =
    useState<SingleValue<Option>>(null);
  const [selectedExercises, setSelectedExercises] = useState<Option[]>([]);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const sports = [
      initialData?.profile_sport1,
      initialData?.profile_sport2,
      initialData?.profile_sport3,
    ].filter(Boolean);
    setSelectedExercises(
      sports.map((sport) => ({ label: sport, value: sport }))
    );
  }, [initialData]);

  useEffect(() => {
    const isFormModified =
      gender !== initialData?.profile_gender ||
      age !== initialData?.profile_age ||
      height !== initialData?.profile_height ||
      weight !== initialData?.profile_weight ||
      allergy !== initialData?.profile_allergy ||
      goal !== initialData?.profile_goal ||
      workoutFrequency !== initialData?.profile_workout_frequency ||
      selectedRegion !== initialData?.profile_region?.split(", ")[0] ||
      selectedCity !== initialData?.profile_region?.split(", ")[1] ||
      selectedExercises.length !==
        [
          initialData?.profile_sport1,
          initialData?.profile_sport2,
          initialData?.profile_sport3,
        ].filter(Boolean).length ||
      selectedExercises.some(
        (exercise, index) =>
          exercise.value !==
          [
            initialData?.profile_sport1,
            initialData?.profile_sport2,
            initialData?.profile_sport3,
          ][index]
      );

    setIsModified(isFormModified);

    // 디버깅용 로그
    console.log("폼 변경 여부:", isFormModified);
  }, [
    gender,
    age,
    height,
    weight,
    allergy,
    goal,
    workoutFrequency,
    selectedRegion,
    selectedCity,
    selectedExercises,
    initialData,
  ]);

  const cities = selectedRegion ? regions[selectedRegion] : [];
  const categoryOptions = categoryData.categories.map((category) => ({
    label: category,
    value: category,
  }));
  const subOptions = selectedCategory
    ? categoryData.subcategories[selectedCategory.value].map((exercise) => ({
        label: exercise,
        value: exercise,
      }))
    : [];

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
    const profileData = {
      profile_gender: gender,
      profile_age: age,
      profile_height: height,
      profile_weight: weight,
      profile_allergy: allergy,
      profile_goal: goal,
      profile_workout_frequency: workoutFrequency,
      profile_region: `${selectedRegion}, ${selectedCity}`,
      profile_sport1:
        selectedExercises[0]?.value || initialData?.profile_sport1 || "",
      profile_sport2:
        selectedExercises[1]?.value || initialData?.profile_sport2 || "",
      profile_sport3:
        selectedExercises[2]?.value || initialData?.profile_sport3 || "",
    };
    console.log("fatch req profileData : ", profileData);

    try {
      const response = await api.patch("profile/update", profileData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("수정 성공:", response.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "수정 오류:",
        axiosError.response ? axiosError.response.data : axiosError.message
      );
    }
  };

  return (
    <FormContainer>
      <FormRow>
        <label>성별</label>
        <div>
          <input
            type="radio"
            name="gender"
            value="M"
            onChange={() => setGender("M")}
            checked={gender === "M"}
          />
          남성
          <input
            type="radio"
            name="gender"
            value="F"
            onChange={() => setGender("F")}
            checked={gender === "F"}
          />
          여성
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
        <UnifiedSelect
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">시도를 선택하세요</option>
          {Object.keys(regions).map((region) => (
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
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">시군구를 선택하세요</option>
          {cities.map((city) => (
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
        />
      </FormRow>
      <FormRow>
        <label>활동량</label>
        <UnifiedSelect
          value={workoutFrequency || ""}
          onChange={(e) => setWorkoutFrequency(parseInt(e.target.value, 10))}
        >
          <option value="">활동량을 선택하세요</option>
          <option value="1">가벼운 활동</option>
          <option value="2">중간 활동</option>
          <option value="3">적극적인 활동</option>
        </UnifiedSelect>
      </FormRow>
      <FormRow>
        <label>운동목표</label>
        <StyledInput
          type="text"
          value={goal || ""}
          onChange={(e) => setGoal(e.target.value)}
        />
      </FormRow>
      <FormRow>
        <label>운동 카테고리</label>
        <UnifiedReactSelect
          options={categoryOptions}
          value={selectedCategory}
          onChange={(newValue) =>
            setSelectedCategory(newValue as SingleValue<Option>)
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
        />
      </FormRow>
      <SelectedExercisesContainer>
        {selectedExercises.map((exercise, index) => (
          <ExerciseTag
            key={exercise.value}
            onClick={() => removeExercise(exercise)}
          >
            {index + 1}등 관심: {exercise.label}
          </ExerciseTag>
        ))}
      </SelectedExercisesContainer>
      <SaveButtonContainer>
        <button type="button" onClick={handleSave} disabled={!isModified}>
          수정
        </button>
      </SaveButtonContainer>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
`;

const UnifiedSelect = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
`;

const UnifiedReactSelect = styled(Select)`
  font-size: 1rem;
`;

const SelectedExercisesContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ExerciseTag = styled.span`
  background-color: #f0f0f0;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default ProfileForm;
