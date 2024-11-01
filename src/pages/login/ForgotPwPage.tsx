import React, { useState } from "react";
import api from "../../services/api/axios";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios"; // axios와 AxiosError를 임포트합니다.
import { useAuth } from "../../context/AuthContext"; // AuthContext에서 useAuth 훅 임포트

function ForgotPwPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 유효성 상태 추가
  const [checkButtonDisabled, setCheckButtonDisabled] = useState(true); // Check 버튼 비활성화 상태
  const [emailCheckError, setEmailCheckError] = useState(""); // 이메일 중복 체크 에러 메시지
  const [isCertificationCodeValid, setIsCertificationCodeValid] =
    useState(false); // 인증 코드 유효성 상태
  const [verificationError, setVerificationError] = useState(""); // 인증 코드 확인 에러 메시지
  const [certificationCode, setCertificationCode] = useState("");

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
  return (
    <Container>
      <LoginForm>
        <Title>Find Password</Title>
        <Input>
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
                placeholder="가입되어 있는 이메일을 입력해주세요."
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
          </form>
        </Input>
      </LoginForm>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh; /* 전체 화면 높이 설정 */
  display: flex;
  justify-content: center;
  align-items: center; /* 수직 중앙 정렬 */
  padding-top: 20px; /* 위쪽 여백 추가 */
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 상단 정렬 */
  align-items: flex-start; /* 왼쪽 정렬 */
  width: 100%;
  max-width: 400px; /* 최대 너비 설정 */
  min-height: 380px; /* 최소 높이 설정 */

  border: solid #ccd1d9 1px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px; /* 내부 여백 추가 */
  margin-top: -50px;
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

export default ForgotPwPage;
