import React from "react";
import api from "../../services/api/axios";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // AuthContext에서 useAuth 훅 임포트
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function MyPage(): JSX.Element {
  return (
    <Container>
      <Header>
        <IconWrapper>
          <FontAwesomeIcon icon={faUser} />
        </IconWrapper>
        <NickName>NickName</NickName>
        <Divider />
        <InfoBars>
          <TodayCal>
            <h3>오늘 칼로리 (탄/단/지)</h3>
            <h1>In : 1300Kcal (30% / 42% / 28%)</h1>
            <h1>Out : 300Kcal | 500Kcal 더 먹을 수 있어요!</h1>
          </TodayCal>
          <PlanCal>
            <h3>목표 칼로리 (탄/단/지)</h3>
            <h1>15000Kcal (30% / 50% / 20%)</h1>
          </PlanCal>
        </InfoBars>
        <InfoBars>
          <h3>ghk</h3>
        </InfoBars>
        <Divider />
      </Header>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: 2px solid #ddd;
  margin-bottom: 8px;
  font-size: 1.5em; /* Adjusts icon size */
`;

const NickName = styled.h2`
  margin: 4px 0;
  font-size: 1.3em;
  color: #333;
`;

const Divider = styled.hr`
  width: 75%;
  border: none;
  border-top: 1.5px solid #999;
  margin: 16px 0;
`;

const InfoBars = styled.div`
  width: 75%;
  display: flex;
  justify-content: space-between;
  text-align: center;
`;

const TodayCal = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;

  h3 {
    margin: 4px 0;
    font-size: 0.9em;
    color: #666;
  }

  h1 {
    margin: 6px 0;
    font-size: 1.1em;
    color: #333;
  }
`;

const PlanCal = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;

  h3 {
    margin: 4px 0;
    font-size: 0.9em;
    color: #666;
  }

  h1 {
    margin: 6px 0;
    font-size: 1.1em;
    color: #333;
  }
`;

export default MyPage;
