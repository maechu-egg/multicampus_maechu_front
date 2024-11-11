import React, { useState } from "react";
import styled from "styled-components";
import { AxiosError } from "axios";
import api from "../../services/api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SignPage(): JSX.Element {
  const [member_img, setMemberImg] = useState<File | null>(null); // 프로필 이미지 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState(""); // 전화번호 상태
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [certificationCode, setCertificationCode] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 유효성 상태 추가
  const [checkButtonDisabled, setCheckButtonDisabled] = useState(true); // Check 버튼 비활성화 상태
  const [emailCheckError, setEmailCheckError] = useState(""); // 이메일 중복 체크 에러 메시지
  const [verificationError, setVerificationError] = useState(""); // 인증 코드 확인 에러 메시지
  const [nicknameCheckError, setNicknameCheckError] = useState(""); // 닉네임 중복 체크 에러 메시지
  const [isCertificationCodeValid, setIsCertificationCodeValid] =
    useState(false); // 인증 코드 유효성 상태
  const [isNicknameValid, setIsNicknameValid] = useState(false); // 닉네임 유효성 상태
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 생성
  const { dispatch, state } = useAuth(); // AuthContext에서 dispatch 함수와 state 가져오기

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규 표현식
    return emailPattern.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const isValid = validateEmail(value);
    setEmailError(!isValid); // 이메일 유효성 검사
    setIsEmailValid(isValid); // 이메일 유효성 상태 업데이트
    setCheckButtonDisabled(!isValid); // 이메일이 유효하지 않으면 Check 버튼 비활성화
    setEmailCheckError(""); // 이메일 체크 에러 메시지 초기화
  };

  const handleCheckEmail = async () => {
    try {
      const response = await api.post("/user/register/email-check", {
        email,
      });
      if (response.status === 200) {
        // 이메일 사용 가능
        setCheckButtonDisabled(false); // Check 버튼 활성화
        setEmailCheckError("인증코드 발송"); // 인증 코드 발송 메시지 설정
        setIsEmailValid(true); // 이메일 유효성 상태 업데이트

        // 인증 코드 전송 요청
        await api.post("/user/register/email-certification", {
          email,
        });
        console.log("인증 코드가 발송되었습니다.");
      }
    } catch (error) {
      const axiosError = error as AxiosError; // error를 AxiosError로 캐스팅합니다.
      if (axiosError.response && axiosError.response.status === 409) {
        // 중복된 이메일
        setCheckButtonDisabled(true); // Check 버튼 비활성화
        setEmailCheckError("중복된 이메일입니다."); // 에러 메시지 설정
        setIsEmailValid(false); // 이메일 유효성 상태 업데이트
      } else {
        console.error("이메일 체크 오류:", error);
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value.length < 6); // 비밀번호 길이 검사
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value !== password); // 비밀번호 확인 일치 검사
  };

  const handleCertificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCertificationCode(e.target.value); // 인증 코드 입력 처리
    setIsCertificationCodeValid(false); // 인증 코드 유효성 초기화
  };

  const handleVerifyCode = async () => {
    try {
      const response = await api.post("/user/register/verify-certification", {
        email,
        certificationCode,
      });
      if (response.status === 200) {
        // 인증 성공
        console.log("인증 코드가 확인되었습니다.");
        setIsCertificationCodeValid(true); // 인증 코드 유효성 상태 업데이트
        setVerificationError(""); // 에러 메시지 초기화
      }
    } catch (error) {
      const axiosError = error as AxiosError; // error를 AxiosError로 캐스팅합니다.
      if (axiosError.response && axiosError.response.status === 400) {
        // 인증 실패
        setIsCertificationCodeValid(false); // 인증 코드 유효성 상태 업데이트
        setVerificationError("인증 코드가 유효하지 않습니다."); // 에러 메시지 설정
      } else {
        console.error("인증 코드 확인 오류:", error);
      }
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameCheckError(""); // 닉네임 체크 에러 메시지 초기화
    setIsNicknameValid(false); // 닉네임 유효성 초기화
  };

  const handleCheckNickname = async () => {
    try {
      const response = await api.post("/user/register/nickname-check", {
        nickname,
      });
      if (response.status === 200) {
        // 닉네임 사용 가능
        setNicknameCheckError(""); // 에러 메시지 초기화
        setIsNicknameValid(true); // 닉네임 유효성 상태 업데이트
        console.log("닉네임 사용 가능");
      }
    } catch (error) {
      const axiosError = error as AxiosError; // error를 AxiosError로 캐스팅합니다.
      if (axiosError.response && axiosError.response.status === 409) {
        // 중복된 닉네임
        setNicknameCheckError("중복된 닉네임입니다."); // 에러 메시지 설정
        setIsNicknameValid(false); // 닉네임 유효성 상태 업데이트
      } else {
        console.error("닉네임 체크 오류:", error);
      }
    }
  };

  const handleSignUp = async () => {
    try {
      const formData = new FormData();

      // member_img가 null이 아닐 때만 추가
      if (member_img) {
        formData.append("memberImgFile", member_img); // 프로필 이미지
      }

      formData.append("nickname", nickname); // 닉네임
      formData.append("password", password); // 비밀번호
      formData.append("email", email); // 이메일
      formData.append("phone", phone); // 전화번호

      // FormData의 내용을 출력
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // API 요청
      const response = await api.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 응답 처리
      if (response.status === 200) {
        console.log("회원가입 성공:", response.data);
        const loginResponse = await api.post("/user/login", {
          email,
          password,
        });
        console.log("서버 응답:", loginResponse.data); // 서버 응답 확인
        const { token, memberId } = loginResponse.data; // 서버에서 받은 token과 memberId

        if (token) {
          alert("로그인 성공!"); // 로그인 성공 알림
          localStorage.setItem("authToken", token); // 로컬 스토리지에 토큰 저장
          localStorage.setItem("memberId", memberId.toString()); // 로컬 스토리지에 memberId 저장
          dispatch({ type: "LOGIN", payload: { token, memberId } }); // Context에 token과 memberId 저장

          // Context에서 저장된 값을 가져와서 출력
          console.log("로그인 후 Context 상태:", state); // Context 상태 출력

          navigate("/profile"); // 홈페이지로 이동
        } else {
          alert("토큰을 받을 수 없습니다."); // 토큰이 없을 경우 알림
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "회원가입 오류:",
        axiosError.response ? axiosError.response.data : axiosError.message
      );
      // 추가적인 오류 처리 로직
    }
  };
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
              onChange={(e) => setMemberImg(e.target.files?.[0] || null)} // 파일 선택 시 상태 업데이트
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
                onClick={handleCheckEmail} // 이메일 체크 버튼 클릭 시 핸들러 호출
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
                onClick={handleVerifyCode} // 인증 코드 확인 버튼 클릭 시 핸들러 호출
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
                onClick={handleCheckNickname} // 닉네임 체크 버튼 클릭 시 핸들러 호출
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
              style={{ width: "100%", marginRight: "10px" }}
            />
            <input
              type="password"
              className={`form-control ${confirmPasswordError ? "is-invalid" : ""}`}
              id="inputConfirmPassword"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              style={{ width: "100%", marginRight: "10px", marginTop: "10px" }}
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
                className="btn btn-dark"
                onClick={handleSignUp} // Sign Up 버튼 클릭 시 핸들러 호출
                disabled={
                  !isEmailValid ||
                  !isNicknameValid ||
                  confirmPasswordError ||
                  !isCertificationCodeValid
                } // 버튼 비활성화 조건
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
  height: 100vh; /* 전체 화면 높이 설정 */
  display: flex;
  justify-content: center;
  align-items: center; /* 수직 중앙 정렬 */
`;

const SignForm = styled.div`
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
  margin-top: 15%;
`;

const Title = styled.h1`
  width: 100%;
  font-size: 2.5rem;
  font-weight: 1000;
  text-align: left; /* 왼쪽 정렬 */
  margin-bottom: 20px; /* 제목 아래 여백 */
  color: #333333;
  padding: 20px;
`;

const Input = styled.div`
  width: 100%;
`;

export default SignPage;
