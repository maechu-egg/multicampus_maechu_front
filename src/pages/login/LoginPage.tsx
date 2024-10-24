import React from "react";
import api from "../../services/api/axios";
import styled from "styled-components";

function LoginPage(): JSX.Element {
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
              value="test@example.com"
            />
            <label htmlFor="floatingInputValue">Input with value</label>
          </form>
          <form className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInputValue"
              placeholder="name@example.com"
              value="test@example.com"
            />
            <label htmlFor="floatingInputValue">Input with value</label>
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
  min-height: 500px; /* 최소 높이 설정 */
  border: solid #ccd1d9 1px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px; /* 내부 여백 추가 */
  margin-top: -100px;
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
  padding: 20px;
`;

export default LoginPage;
