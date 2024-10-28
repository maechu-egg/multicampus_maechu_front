import React, { useState } from "react";
import api from "../../services/api/axios";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrMsg, setEmailErrMsg] = useState(""); // Initialize email error message state
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 생성

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailText = e.target.value;
    setEmail(emailText);

    if (emailText === "") {
      setEmailErrMsg("이메일은 필수 입력 값입니다.");
    } else if (!emailText.includes("@")) {
      setEmailErrMsg("이메일 형식을 지켜주세요");
    } else {
      setEmailErrMsg("");
    }
  };

  const handleLogin = async () => {
    // 이메일과 비밀번호가 유효한지 확인
    if (emailErrMsg) {
      alert("이메일을 확인하세요.");
      return;
    }

    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });
      console.log(response.data); // 서버의 응답 데이터 처리
      alert("로그인 성공!"); // 로그인 성공 알림
      // navigate("/"); // 홈페이지로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도하세요.");
      // 로그인 실패 시 입력값 초기화
      setEmail(""); // 이메일 초기화
      setPassword(""); // 비밀번호 초기화
    }
  };

  return (
    <Container>
      <LoginForm>
        <Title>Login</Title>
        <Input>
          <form className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInputValue"
              placeholder="name@example.com"
              value={email} // Bind email state
              onChange={onEmailChange} // Handle email change
              style={{ width: "100%" }}
            />
            <label htmlFor="floatingInputValue">Input with Email</label>
            {emailErrMsg && <ErrMsg>{emailErrMsg}</ErrMsg>}{" "}
            {/* Conditionally render error message */}
          </form>
          <form className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingInputPassword"
              placeholder="Password"
              value={password} // Bind password state
              onChange={(e) => setPassword(e.target.value)} // Handle password change
              style={{ width: "100%", marginTop: "20px" }}
            />
            <label htmlFor="floatingInputPassword">Input with Password</label>
          </form>
        </Input>

        <ButtonGroup>
          <Link to="/signpage">
            <button
              type="button"
              className="btn btn-link"
              style={{ marginRight: "-6px" }}
            >
              Sign Up
            </button>
          </Link>
          <Link to="/forgotpwpage">
            <button type="button" className="btn btn-link">
              Forgot Password
            </button>
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: "80px" }}
            onClick={handleLogin} // 로그인 버튼 클릭 시 handleLogin 호출
          >
            Login
          </button>
        </ButtonGroup>
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  margin-top: 30px;
  padding-right: 10px;
`;

const ErrMsg = styled.div`
  color: red; /* 에러 메시지를 빨간색으로 설정 */
  margin-top: 5px; /* 에러 메시지 위쪽 여백 */
`;

export default LoginPage;
