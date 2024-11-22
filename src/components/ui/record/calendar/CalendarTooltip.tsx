import React from 'react';
import styled from 'styled-components';

interface CalendarTooltipProps {
  text: React.ReactNode;
  children?: React.ReactNode;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.div`
  visibility: hidden;
  max-width: 300px;
  min-width: 150px;
  width: 250px;
  background-color: rgba(0, 0, 0, 0.9);
  color: #fff;
  text-align: center;
  border-radius: 8px;
  padding: 10px;
  position: absolute;
  z-index: 1;
  top: 100%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  box-shadow: 0 4px 12px rgba(0.5, 0.5, 0.5, 0.5);

  ${TooltipContainer}:hover & {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

 @media (max-width: 880px) {
    width: 200px;
    padding: 8px;
  } 

  @media (max-width: 700px) {
    width: 150px;  // 예시로 너비를 더 줄였습니다.
    padding: 6px;  // 작은 화면에서 여백을 조정해 텍스트가 더 잘 맞도록 해줍니다.
  }
`;

const CalendarTooltip: React.FC<CalendarTooltipProps> = ({ text, children }) => {
  return (
    <TooltipContainer>
      {children}
      <TooltipText>{text}</TooltipText>
    </TooltipContainer>
  );
};

export default CalendarTooltip;
