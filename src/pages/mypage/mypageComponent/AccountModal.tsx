import React, { useState } from "react";
import styled from "styled-components";
import { AxiosError } from "axios";
import api from "services/api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "context/AuthContext";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: {
    email: string;
    memberId: number;
    memberImg: string;
    nickname: string;
    phone: string;
    verified: boolean;
  };
  onUpdate: () => void;
}

function AccountModal({
  isOpen,
  onClose,
  userInfo,
  onUpdate,
}: AccountModalProps): JSX.Element | null {
  const { state: authState, logout } = useAuth();
  const { token } = authState;

  const [member_img, setMemberImg] = useState<File | null>(null);
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [nicknameCheckError, setNicknameCheckError] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameCheckError("");
    setIsNicknameValid(false);
  };
  //닉네임 중복
  const handleCheckNickname = async () => {
    try {
      const response = await api.post("/user/register/nickname-check", {
        nickname,
      });
      if (response.status === 200) {
        setNicknameCheckError("");
        setIsNicknameValid(true);
        console.log("닉네임 사용 가능");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 409) {
        setNicknameCheckError("중복된 닉네임입니다.");
        setIsNicknameValid(false);
      } else {
        console.error("닉네임 체크 오류:", error);
      }
    }
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "에이 설마; 정말 탈퇴할거라고?! 운동 기록 날려버릴거야??"
    );

    if (confirmDelete) {
      try {
        const response = await api.delete("/user/delete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log("탈퇴 성공:", response.data);
          onClose();
          onUpdate();
        }
      } catch (error) {
        console.error("탈퇴 오류:", error);
      }
    } else {
      console.log("탈퇴가 취소되었습니다.");
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      if (member_img) {
        formData.append("memberImgFile", member_img);
      } else {
        formData.append("member_img", userInfo.memberImg);
      }

      formData.append("nickname", nickname || userInfo.nickname);
      formData.append("phone", phone || userInfo.phone);

      const response = await api.patch("/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("수정 성공:", response.data);
        onClose();
        onUpdate();
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "수정 오류:",
        axiosError.response ? axiosError.response.data : axiosError.message
      );
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Account</Title>

        <InfoContainer>
          <label className="form-label">Profile Image</label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={(e) => setMemberImg(e.target.files?.[0] || null)}
          />

          <label className="form-label">Nickname</label>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className={`form-control ${nicknameCheckError ? "is-invalid" : isNicknameValid ? "is-valid" : ""}`}
              id="nickname"
              placeholder={userInfo.nickname}
              value={nickname}
              onChange={handleNicknameChange}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCheckNickname}
            >
              Check
            </button>
          </div>
          <div
            className={`form-text ${nicknameCheckError ? "text-danger" : ""}`}
          >
            {nicknameCheckError}
          </div>

          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="inputPhoneNumber"
            placeholder={userInfo.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <FooterContainer>
            <StyledLink to="/forgotpwpage">
              비밀번호는 찾기 페이지에서 변경 가능합니다.
            </StyledLink>
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleUpdate}
            >
              수정
            </button>
          </FooterContainer>
          <DeleteAccountButton onClick={handleDelete}>
            탈퇴하시겠습니까 ? 정말로 ? 엥 왜 ?
          </DeleteAccountButton>
        </InfoContainer>
      </ModalContainer>
    </ModalOverlay>
  );
}
//탈퇴 버튼 되어 있는데
const Title = styled.h1`
  width: 100%;
  font-size: 2.5rem;
  font-weight: 1000;
  text-align: left;
  margin-bottom: 20px;
  color: #333333;
  padding: 20px;
`;

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

const ModalContainer = styled.div`
  width: 450px;
  max-height: 100vh;
  overflow-y: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.2em;
  background: none;
  border: none;
  cursor: pointer;
`;
const DeleteAccountButton = styled.div`
  display: flex;
  justify-content: center;
  color: gray;
  margin-top: 40px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const InfoContainer = styled.div`
  margin-top: 10px;
  text-align: left;

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #555;
    margin-bottom: 5px;
  }

  .form-control {
    width: 100%;
    margin-bottom: 15px;
  }

  .btn {
    margin-left: 10px;
  }
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const StyledLink = styled(Link)`
  font-size: 0.9rem;
  font-weight: 600;
  color: red;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: darkred;
  }
`;

export default AccountModal;
