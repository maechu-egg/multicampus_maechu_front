import React from "react";
import api from "../../services/api/axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

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
              style={{ width: "100%" }}
            />
            <label htmlFor="floatingInputValue">Input with Email</label>
          </form>
          <form className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingInputValue"
              placeholder="name@example.com"
              value="test@example.com"
              style={{ width: "100%", marginTop: "20px" }}
            />
            <label htmlFor="floatingInputValue">Input with Password</label>
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

export default LoginPage;
