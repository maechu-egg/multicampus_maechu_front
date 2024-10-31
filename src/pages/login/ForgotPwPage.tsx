import React, { useState } from "react";
import api from "../../services/api/axios";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // AuthContext에서 useAuth 훅 임포트

function ForgotPwPage(): JSX.Element {
  return (
    <Container>
      <LoginForm>
        <Title>Find Password</Title>
        <Input>
          <form>
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <div
              className="mb-3"
              style={{ display: "flex", alignItems: "center" }}
            >
              {" "}
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                style={{ marginRight: "10px" }} // Add some space between input and button
              />
              <button type="submit" className="btn btn-secondary">
                Submit
              </button>
            </div>
            <div
              id="emailHelp"
              className="form-text"
              style={{ color: "red", marginTop: "-10px", marginBottom: "13px" }}
            >
              We'll never share your email with anyone else.
            </div>

            <label htmlFor="exampleInputPassword1" className="form-label">
              Email Verification Code
            </label>
            <div
              className="mb-3"
              style={{ display: "flex", alignItems: "center" }}
            >
              {" "}
              <input
                type="text"
                className="form-control"
                style={{ marginRight: "10px" }}
                placeholder="보내준 인증코드 넣어라"
              />
              <button type="submit" className="btn btn-secondary">
                Check
              </button>
            </div>
          </form>

          <form style={{ width: "100%" }}>
            <div className="mb-3" style={{ width: "100%" }}>
              <label
                htmlFor="inputPassword3"
                className="col-sm-2 col-form-label"
              >
                Password
              </label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword3"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="mb-3" style={{ width: "100%" }}>
              <label
                htmlFor="inputPassword3"
                className="col-sm-2 col-form-label"
              >
                Password
              </label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword3"
                  style={{ width: "100%" }}
                />
              </div>
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
