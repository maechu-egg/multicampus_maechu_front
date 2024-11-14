import React, { useState } from "react";
import styled from "styled-components";
import { AxiosError } from "axios";
import api from "services/api/axios";
import { Link, useNavigate } from "react-router-dom";
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
}

function AccountModal({
  isOpen,
  onClose,
  userInfo,
}: AccountModalProps): JSX.Element | null {
  const [member_img, setMemberImg] = useState<File | null>(null);
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
  const { dispatch, state } = useAuth();

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
        // 존재하지 않는 이메일인 경우
        setCheckButtonDisabled(true); // Check 버튼 비활성화
        setEmailCheckError("존재하지 않는 이메일입니다."); // 에러 메시지 설정
        setIsEmailValid(false); // 이메일 유효성 상태 업데이트
      }
    } catch (error) {
      const axiosError = error as AxiosError; // error를 AxiosError로 캐스팅합니다.
      if (axiosError.response) {
        if (axiosError.response.status === 409) {
          // 존재하는 이메일인 경우
          setCheckButtonDisabled(false); // Check 버튼 활성화
          setEmailCheckError("인증코드 발송"); // 인증 코드 발송 메시지 설정
          setIsEmailValid(true); // 이메일 유효성 상태 업데이트

          // 인증 코드 전송 요청
          try {
            await api.post("/user/register/email-certification", {
              email,
            });
            console.log("인증 코드가 발송되었습니다.");
          } catch (certificationError) {
            console.error("인증 코드 전송 오류:", certificationError);
            setEmailCheckError("인증 코드 전송에 실패했습니다."); // 에러 메시지 설정
          }
        } else if (axiosError.response.status === 400) {
          // 잘못된 이메일 형식
          setCheckButtonDisabled(true); // Check 버튼 비활성화
          setEmailCheckError("이메일 형식이 올바르지 않습니다."); // 에러 메시지 설정
          setIsEmailValid(false); // 이메일 유효성 상태 업데이트
        } else {
          console.error("이메일 체크 오류:", error);
        }
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

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Account</Title>
        <ProfileImage src={userInfo.memberImg} alt="Profile" />
        <InfoContainer>
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
                placeholder={userInfo.email}
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
                placeholder={userInfo.nickname}
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
              placeholder={userInfo.phone}
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
                수정
              </button>
            </div>
          </form>
        </InfoContainer>
      </ModalContainer>
    </ModalOverlay>
  );
}

const Title = styled.h1`
  width: 100%;
  font-size: 2.5rem;
  font-weight: 1000;
  text-align: left; /* 왼쪽 정렬 */
  margin-bottom: 20px; /* 제목 아래 여백 */
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
  max-height: 90vh; /* 최대 높이 설정 */
  overflow-y: auto; /* 내부 스크롤 추가 */
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

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  margin-top: 10px;

  h2 {
    font-size: 1.5em;
    margin: 10px 0;
  }

  p {
    margin: 5px 0;
    font-size: 1em;
    color: #555;
  }
`;

export default AccountModal;
