import React, { useState } from "react";
import styled from "styled-components";
import { AxiosError } from "axios";
import api from "../../services/api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SignPage(): JSX.Element {
  const [member_img, setMemberImg] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [certificationCode, setCertificationCode] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [checkButtonDisabled, setCheckButtonDisabled] = useState(true);
  const [emailCheckError, setEmailCheckError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [nicknameCheckError, setNicknameCheckError] = useState("");
  const [isCertificationCodeValid, setIsCertificationCodeValid] =
    useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isVerificationButtonDisabled, setIsVerificationButtonDisabled] =
    useState(false);
  const navigate = useNavigate();
  const { dispatch, state } = useAuth();

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const isValid = validateEmail(value);
    setEmailError(!isValid);
    setIsEmailValid(isValid);
    setCheckButtonDisabled(!isValid);
    setEmailCheckError("");

    if (isVerificationButtonDisabled) {
      setIsVerificationButtonDisabled(false);
    }
  };

  const handleCheckEmail = async () => {
    try {
      const response = await api.post("/user/register/email-check", {
        email,
      });
      if (response.status === 200) {
        setCheckButtonDisabled(false);
        setEmailCheckError("인증코드 발송");
        setIsEmailValid(true);

        await api.post("/user/register/email-certification", {
          email,
        });
        console.log("인증 코드가 발송되었습니다.");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 409) {
        setCheckButtonDisabled(true);
        setEmailCheckError("중복된 이메일입니다.");
        setIsEmailValid(false);
      } else {
        console.error("이메일 체크 오류:", error);
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value.length < 6);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value !== password);
  };

  const handleCertificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCertificationCode(e.target.value);
    setIsCertificationCodeValid(false);
  };

  const handleVerifyCode = async () => {
    try {
      const response = await api.post("/user/register/verify-certification", {
        email,
        certificationCode,
      });
      if (response.status === 200) {
        console.log("인증 코드가 확인되었습니다.");
        setIsCertificationCodeValid(true);
        setVerificationError("");
        setIsVerificationButtonDisabled(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 400) {
        setIsCertificationCodeValid(false);
        setVerificationError("인증 코드가 유효하지 않습니다.");
      } else {
        console.error("인증 코드 확인 오류:", error);
      }
    }
  };

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

  const handleSignUp = async () => {
    try {
      const formData = new FormData();
      if (member_img) {
        formData.append("memberImgFile", member_img);
      }
      formData.append("nickname", nickname);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("phone", phone);

      const response = await api.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("회원가입 성공:", response.data);
        const loginResponse = await api.post("/user/login", {
          email,
          password,
        });
        console.log("서버 응답:", loginResponse.data);
        const { token, memberId } = loginResponse.data;

        if (token) {
          alert("로그인 성공!");
          localStorage.setItem("authToken", token);
          localStorage.setItem("memberId", memberId.toString());
          dispatch({ type: "LOGIN", payload: { token, memberId } });
          console.log("로그인 후 Context 상태:", state);
          navigate("/profile");
        } else {
          alert("토큰을 받을 수 없습니다.");
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "회원가입 오류:",
        axiosError.response ? axiosError.response.data : axiosError.message
      );
    }
  };

  const isSignUpEnabled =
    isEmailValid &&
    isNicknameValid &&
    !passwordError &&
    !confirmPasswordError &&
    isCertificationCodeValid &&
    password === confirmPassword;

  return (
    <Container>
      <SignForm>
        <Title>Sign Up</Title>
        <Input>
          <div className="mb-3">
            <label htmlFor="formFile" className="form-label">
              프로필 이미지
            </label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={(e) => setMemberImg(e.target.files?.[0] || null)}
              style={{ width: "100%" }}
            />
          </div>
          <form>
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <div className="mb-3 d-flex align-items-center">
              <input
                type="email"
                className={`form-control ${emailError ? "is-invalid" : isEmailValid ? "is-valid" : ""}`}
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={email}
                onChange={handleEmailChange}
                placeholder="사용할 이메일을 입력해주세요"
                style={{ width: "100%", marginRight: "10px" }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                disabled={checkButtonDisabled}
                onClick={handleCheckEmail}
                style={{
                  backgroundColor: checkButtonDisabled ? "#6C757D" : "#212529",
                }}
              >
                Check
              </button>
            </div>
            <div
              id="emailHelp"
              className={`form-text ${emailError || emailCheckError ? "text-danger" : ""}`}
            >
              {emailError ? "이메일 형식을 맞춰주세요" : emailCheckError}
            </div>

            <label
              htmlFor="certificationCode"
              className="form-label"
              style={{ marginTop: "10px" }}
            >
              Certification Code
            </label>
            <div className="mb-3 d-flex align-items-center">
              <input
                type="text"
                className={`form-control ${isCertificationCodeValid ? "is-valid" : !isCertificationCodeValid && verificationError ? "is-invalid" : ""}`}
                id="certificationCode"
                placeholder="인증 코드를 입력하세요"
                value={certificationCode}
                onChange={handleCertificationCodeChange}
                style={{ width: "100%", marginRight: "10px" }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleVerifyCode}
                disabled={isVerificationButtonDisabled}
                style={{
                  backgroundColor: isVerificationButtonDisabled
                    ? "#6C757D"
                    : "#212529",
                }}
              >
                Verify
              </button>
            </div>
            <div
              className={`form-text ${verificationError ? "text-danger" : ""}`}
            >
              {verificationError}
            </div>

            <label
              htmlFor="nickname"
              className="form-label"
              style={{ marginTop: "10px" }}
            >
              Nickname
            </label>
            <div className="mb-3 d-flex align-items-center">
              <input
                type="text"
                className={`form-control ${nicknameCheckError ? "is-invalid" : isNicknameValid ? "is-valid" : ""}`}
                id="nickname"
                placeholder="사용할 닉네임을 입력해주세요"
                value={nickname}
                onChange={handleNicknameChange}
                style={{ width: "100%", marginRight: "10px" }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCheckNickname}
                style={{
                  backgroundColor: isNicknameValid ? "#A0A5AB" : "#212529",
                }}
              >
                Check
              </button>
            </div>
            <div
              className={`form-text ${nicknameCheckError ? "text-danger" : ""}`}
            >
              {nicknameCheckError}
            </div>

            <label
              htmlFor="inputPassword3"
              className="form-label"
              style={{ marginTop: "10px" }}
            >
              Password
            </label>
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              id="inputPassword3"
              placeholder="6자 이상 입력"
              value={password}
              onChange={handlePasswordChange}
              style={{
                width: "100%",
                marginRight: "10px",
                fontFamily: "monospace",
              }}
            />
            <input
              type="password"
              className={`form-control ${confirmPasswordError ? "is-invalid" : ""}`}
              id="inputConfirmPassword"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              style={{
                width: "100%",
                marginRight: "10px",
                marginTop: "10px",
                fontFamily: "monospace",
              }}
            />

            <label
              htmlFor="inputPhoneNumber"
              className="form-label"
              style={{ marginTop: "15px" }}
            >
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              id="inputPhoneNumber"
              placeholder="전화번호 입력"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSignUp}
                disabled={!isSignUpEnabled}
                style={{
                  backgroundColor: isSignUpEnabled ? "#212529" : "#6C757D",
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </Input>
      </SignForm>
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

const SignForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 500px;
  min-height: 500px;
  border: solid #ccd1d9 1px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 5%;
  margin-bottom: 20%;
`;

const Title = styled.h1`
  width: 100%;
  font-size: 2.5rem;
  font-weight: 1000;
  text-align: left;
  margin-bottom: 20px;
  color: #333333;
  padding: 20px;
`;

const Input = styled.div`
  width: 100%;
`;

export default SignPage;
