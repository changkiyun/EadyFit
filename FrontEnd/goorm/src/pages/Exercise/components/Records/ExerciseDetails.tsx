import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useExercise } from "../../../../contexts/exerciseContext";
import { ExerciseRecords } from "../../ExerciseTypes";
import DeleteModal from "../Modal/DeleteModal";
import { ModalStore } from "../../../../store/store";
import { deleteRecord } from "../../../../api/Exercise/exerciseApi";

interface ExerciseDetailProps {
  exercise: ExerciseRecords;
  isAddingExercise: boolean; // 새로운 운동 여부
  details: ExerciseRecords;
}

// 운동 세부정보 입력하는 컴포넌트
const ExerciseDetails: React.FC<ExerciseDetailProps> = ({
  exercise,
  details,
  isAddingExercise,
}) => {
  const [exerciseName, setExerciseName] = useState<string>(
    exercise.trainingName || ""
  );
  const [distance, setDistance] = useState<string>(
    details.distance?.toString() || ""
  );
  const [duration, setDuration] = useState<string>(
    details.durationMinutes?.toString() || "0"
  );
  const [slope, setSlope] = useState<string>(
    details.incline?.toString() || "0"
  );
  const [calorie, setCalorie] = useState<string>(
    details.caloriesBurned?.toString() || "0"
  );
  const [sets, setSets] = useState<string>(details.sets?.toString() || "0");
  const [weight, setWeight] = useState<string>(
    details.weight?.toString() || "0"
  );
  const [count, setCount] = useState<string>(details.reps?.toString() || "0");
  const prevDetailsRef = useRef(details);

  const {
    state: { selectedRecords, exerciseRecords },
    updateExerciseDetails,
    removeExercise,
    setSelectedRecord,
    updateExerciseRecords
  } = useExercise();

  const { modals, openModal, closeModal } = ModalStore();

  useEffect(() => {
    const updatedDetails = {
      ...details,
      trainingName: exerciseName,
      distance: distance ? parseFloat(distance) : 0,
      durationMinutes: duration ? parseInt(duration) : 0,
      incline: slope ? parseFloat(slope) : 0,
      caloriesBurned: calorie ? parseInt(calorie) : 0,
      sets: sets ? parseInt(sets) : 0,
      weight: weight ? parseFloat(weight) : 0,
      reps: count ? parseInt(count) : 0,
    };

    const prevDetails = prevDetailsRef.current;

    // exerciseRecords에서 해당 recordId가 있는지 확인
    const existingRecord = exerciseRecords.find(
      (record) => record.recordId === details.recordId
    );

    // Check if updatedDetails differ from previous details
    if (JSON.stringify(updatedDetails) !== JSON.stringify(prevDetails)) {
      if (existingRecord) {
        // record가 있으면 updateExerciseRecords로 업데이트
        updateExerciseRecords(details.recordId, updatedDetails);
        console.log("Exercise Records Updated:", updatedDetails);
      } else {
        // record가 없으면 updateExerciseDetails로 업데이트
        updateExerciseDetails(updatedDetails);
        console.log("Exercise Details Updated:", updatedDetails);
      }
    }
    prevDetailsRef.current = updatedDetails;
  }, [
    exerciseName,
    distance,
    duration,
    slope,
    calorie,
    sets,
    weight,
    count,
    details,
    updateExerciseRecords,
    updateExerciseDetails,
  ]);

  const handleModalClick = () => {
    openModal("deleteModal");
  };

  const handleModalClose = () => {
    closeModal("deleteModal");
  };

  const handleDeleteModalConfirm = async () => {
    try {
      await deleteRecord(details.recordId);
      removeExercise(details.trainingName); // 상태에서 운동 삭제
      closeModal("deleteModal");
    } catch (err) {
      throw err;
    }
  };

  return (
    <ExerciseDetailsContainer>
      <ExerciseInfo>
        <CategoryBadge>{exercise.categoryName}</CategoryBadge>
        <ExerciseTitle>{exercise.trainingName}</ExerciseTitle>
      </ExerciseInfo>
      <InputContainer>
        {details.categoryName === "유산소" ? (
          <>
            <ExerciseLabel>
              <ExerciseInput
                type="text"
                placeholder="거리"
                value={distance}
                onChange={(e) => {
                  setDistance(e.target.value);
                  const newDistance = parseFloat(e.target.value);
                  if (!isNaN(newDistance)) {
                    const updatedDetails = { distance: newDistance };
                    updateExerciseRecords(details.recordId, updatedDetails);
                  }
                }}
              />
            </ExerciseLabel>
            <ExerciseText>km</ExerciseText>
            <ExerciseLabel>
              <ExerciseInput
                type="text"
                placeholder=" 시간"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  const newDuration = parseInt(e.target.value, 10);
                  if (!isNaN(newDuration)) {
                    const updatedDetails = { durationMinutes: newDuration };
                    updateExerciseRecords(details.recordId, updatedDetails);
                  }
                }}
              />
            </ExerciseLabel>
            <ExerciseText>분</ExerciseText>
            <ExerciseLabel>
              <ExerciseInput
                type="text"
                placeholder="경사"
                value={slope}
                onChange={(e) => {
                  setSlope(e.target.value);
                  const newSlope = parseFloat(e.target.value);
                  if (!isNaN(newSlope)) {
                    const updatedDetails = { incline: newSlope };
                    updateExerciseRecords(details.recordId, updatedDetails);
                  }
                }}
              />
            </ExerciseLabel>
            <ExerciseText>도</ExerciseText>
            <ExerciseLabel>
              <ExerciseInput
                type="text"
                placeholder="칼로리"
                value={calorie}
                onChange={(e) => {
                  setCalorie(e.target.value);
                  const newCalorie = parseInt(e.target.value, 10);
                  if (!isNaN(newCalorie)) {
                    const updatedDetails = { caloriesBurned: newCalorie };
                    updateExerciseRecords(details.recordId, updatedDetails);
                  }
                }}
              />
            </ExerciseLabel>
            <ExerciseText>kcal</ExerciseText>
          </>
        ) : (
          <>
            <SetContainer>
              <ExerciseLabel>
                <ExerciseInput
                  type="text"
                  placeholder=" 시간"
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    const newDuration = parseInt(e.target.value, 10);
                    if (!isNaN(newDuration)) {
                      const updatedDetails = { durationMinutes: newDuration };
                      updateExerciseRecords(details.recordId, updatedDetails);
                    }
                  }}
                />
              </ExerciseLabel>
              <ExerciseText>분</ExerciseText>
              <ExerciseLabel>
                <ExerciseInput
                  type="number"
                  placeholder="세트"
                  value={sets}
                  onChange={(e) => {
                    setSets(e.target.value);
                    const newSets = parseInt(e.target.value, 10);
                    if (!isNaN(newSets)) {
                      const updatedDetails = { sets: newSets };
                      updateExerciseRecords(details.recordId, updatedDetails);
                    }
                  }}
                />
              </ExerciseLabel>
              <ExerciseText>세트</ExerciseText>
              <ExerciseLabel>
                <ExerciseInput
                  type="number"
                  placeholder="중량(kg)"
                  value={weight}
                  step="5"
                  onChange={(e) => {
                    setWeight(e.target.value);
                    const newWeight = parseFloat(e.target.value);
                    if (!isNaN(newWeight)) {
                      const updatedDetails = { weight: newWeight };
                      updateExerciseRecords(details.recordId, updatedDetails);
                    }
                  }}
                />
              </ExerciseLabel>
              <ExerciseText>kg</ExerciseText>
              <ExerciseLabel>
                <ExerciseInput
                  type="number"
                  placeholder="횟수"
                  value={count}
                  onChange={(e) => {
                    setCount(e.target.value);
                    const newReps = parseInt(e.target.value, 10);
                    if (!isNaN(newReps)) {
                      const updatedDetails = { reps: newReps };
                      updateExerciseRecords(details.recordId, updatedDetails);
                    }
                  }}
                />
              </ExerciseLabel>
              <ExerciseText>회</ExerciseText>
            </SetContainer>
          </>
        )}
        <DeleteButton onClick={handleModalClick}>삭제</DeleteButton>
      </InputContainer>
      <DeleteModal
        isOpen={modals.deleteModal?.isOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteModalConfirm}
      />
    </ExerciseDetailsContainer>
  );
};

export default ExerciseDetails;

const ExerciseDetailsContainer = styled.div`
  margin-top: 0.625rem;
  margin-left: 0.9375rem;
  display: flex;
  width: 100%;
  border: 1px solid #afafaf;
  border-radius: 0.9375rem;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-size: 0.875rem;
`;

const ExerciseInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CategoryBadge = styled.span`
  background-color: #007bff;
  color: white;
  border-radius: 0.3125rem;
  margin-left: 0.625rem;
  padding: 0.25rem;
  font-size: 0.875rem;
`;

const ExerciseTitle = styled.h3`
  font-size: 1.125rem;
  margin-left: 0.625rem;
`;

const ExerciseLabel = styled.label`
  margin-left: 0.625rem;
  display: block;
  flex-direction: row;
  margin-bottom: 1rem;
  width: 5.625rem;
  gap: 0;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ExerciseInput = styled.input`
  display: flex;
  width: 100%;
  padding: 0.3125rem;
  margin-top: 1.25rem;
  border: 1px solid #afafaf;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  margin-left: 0.3125rem;
  gap: 0.0625rem;

  // 스핀버튼 항상 보이게 설정하는 CSS
  -webkit-appearance: none;
  -moz-appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: inner-spin-button;
    opacity: 1;
  }
`;

const ExerciseText = styled.span`
  margin-left: 1.3125rem;
`;

const SetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DeleteButton = styled.button`
  margin-right: 0.625rem;
  margin-left: 0.625rem;
  height: 20%;
  background-color: #ff4d4d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.875rem;

  &:hover {
    background-color: #ff1a1a;
  }
`;
