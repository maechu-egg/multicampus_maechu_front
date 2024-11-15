import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AxiosError } from "axios";
import api from "services/api/axios";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element | null {
  const { state: authState } = useAuth();
  const { token } = authState;
  const navigate = useNavigate();

  // 프로필 정보를 저장할 상태 변수
  const [profileInfo, setProfileInfo] = useState<any>({
    nickname: "",
    memberImg: "",
  });

  // 모달이 열릴 때 사용자 정보를 API에서 가져오기
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const response = await api.get("/profile/info", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfileInfo(response.data);
        } catch (error) {
          if (error instanceof AxiosError) {
            console.error("프로필 정보 가져오기 오류:", error.response);
          }
        }
      };
      fetchProfile();
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  // 프로필 저장 함수
  const handleSaveProfile = async () => {
    try {
      const response = await api.patch("/profile/update", profileInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("프로필 업데이트 응답 데이터 : ", response.data);
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("프로필 업데이트 오류 :", error.response);
      }
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>프로필 수정</h2>
        <label>
          닉네임:
          <input
            type="text"
            value={profileInfo.nickname}
            onChange={(e) =>
              setProfileInfo({ ...profileInfo, nickname: e.target.value })
            }
          />
        </label>
        <label>
          프로필 이미지 URL:
          <input
            type="text"
            value={profileInfo.memberImg}
            onChange={(e) =>
              setProfileInfo({ ...profileInfo, memberImg: e.target.value })
            }
          />
        </label>
        <SaveButton onClick={handleSaveProfile}>저장</SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
}

// 스타일 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  position: relative;
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

const SaveButton = styled.button`
  margin-top: 20px;
  background-color: #1d2636;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
`;

export default ProfileModal;
