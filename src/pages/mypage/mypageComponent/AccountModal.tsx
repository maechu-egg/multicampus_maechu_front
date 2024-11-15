import React, { useState } from "react";
import styled from "styled-components";
import { AxiosError } from "axios";
import api from "services/api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
const BASE_URL = "http://localhost:8001";

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
}

function AccountModal({
  isOpen,
  onClose,
  userInfo,
}: AccountModalProps): JSX.Element | null {
  const { state: authState } = useAuth();
  const { token, memberId } = authState;

  const [member_img, setMemberImg] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [checkButtonDisabled, setCheckButtonDisabled] = useState(true);
  const [nicknameCheckError, setNicknameCheckError] = useState("");
  const [isCertificationCodeValid, setIsCertificationCodeValid] =
    useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const navigate = useNavigate();

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameCheckError("");
    setIsNicknameValid(false);
  };

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

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      if (member_img) {
        formData.append("memberImgFile", member_img);
      }
      formData.append("nickname", nickname);
      formData.append("phone", phone);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await api.patch("/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("수정 성공:", response.data);
        onClose();
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
        </InfoContainer>
      </ModalContainer>
    </ModalOverlay>
  );
}

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
  width: 400px;
  max-height: 90vh;
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