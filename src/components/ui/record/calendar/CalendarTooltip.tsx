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
  width: 300px;
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
    overflow: visible;
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 270px;
    padding: 9px;
  }

  @media (max-width: 425px) {
    width: 230px;
    padding: 8px;
  }

  @media (max-width: 375px) {
    width: 210px;
    padding: 7px;
  }

  @media (max-width: 320px) {
    width: 190px;
    padding: 6px;
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
