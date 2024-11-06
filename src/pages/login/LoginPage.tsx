import React, { useState } from "react";
import api from "../../services/api/axios";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // AuthContext에서 useAuth 훅 임포트

function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrMsg, setEmailErrMsg] = useState(""); // 이메일 에러 메시지 상태 초기화
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 생성
  const { dispatch, state } = useAuth(); // AuthContext에서 dispatch 함수와 state 가져오기

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
    if (emailErrMsg) {
      alert("이메일을 확인하세요.");
      return;
    }

    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });
      console.log("서버 응답:", response.data); // 서버 응답 확인
      const { token, memberId } = response.data; // 서버에서 받은 token과 memberId

      if (token) {
        alert("로그인 성공!"); // 로그인 성공 알림
        localStorage.setItem("authToken", token); // 로컬 스토리지에 토큰 저장
        localStorage.setItem("memberId", memberId.toString()); // 로컬 스토리지에 memberId 저장
        dispatch({ type: "LOGIN", payload: { token, memberId } }); // Context에 token과 memberId 저장

        // Context에서 저장된 값을 가져와서 출력
        console.log("로그인 후 Context 상태:", state); // Context 상태 출력

        navigate("/"); // 홈페이지로 이동
      } else {
        alert("토큰을 받을 수 없습니다."); // 토큰이 없을 경우 알림
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도하세요.");
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
              value={email} // 이메일 상태 바인딩
              onChange={onEmailChange} // 이메일 변경 처리
              style={{ width: "100%" }}
            />
            <label htmlFor="floatingInputValue">Input with Email</label>
            {emailErrMsg && <ErrMsg>{emailErrMsg}</ErrMsg>}{" "}
            {/* 에러 메시지 조건부 렌더링 */}
          </form>
          <form className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingInputPassword"
              placeholder="Password"
              value={password} // 비밀번호 상태 바인딩
              onChange={(e) => setPassword(e.target.value)} // 비밀번호 변경 처리
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
  margin-top: -10%;
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
