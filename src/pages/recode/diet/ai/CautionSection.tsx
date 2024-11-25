import styled from "styled-components";

// CautionSection 컴포넌트 추가
const CautionSection: React.FC<{ dietPlan: any }> = ({ dietPlan }) => {
    const extractCautions = (plan: any): string[] => {
      const cautions: string[] = [];
      
      if (plan && plan.dietPlan) {
        const lines: string[] = plan.dietPlan.split('\n');
        let isCautionSection = false;
  
        lines.forEach((line: string) => {
          if (line.includes('주의 사항')) {
            isCautionSection = true;
            return;
          }
  
          if (isCautionSection && line.startsWith('-')) {
            cautions.push(line.replace('-', '').trim());
          }
        });
      }
  
      return cautions;
    };
  
    const cautions = extractCautions(dietPlan);
  
    return (
      <ResultSection>
        <SectionTitle>
          <SectionIcon>⚠️</SectionIcon>
          주의 사항
        </SectionTitle>
        <SectionContent>
          <CautionList>
            {cautions.map((caution, index) => (
              <CautionItem key={index}>
                <CautionIcon>⚠️</CautionIcon>
                <CautionText>{caution}</CautionText>
              </CautionItem>
            ))}
          </CautionList>
        </SectionContent>
      </ResultSection>
    );
  };
  
  export default CautionSection;
// 스타일 컴포넌트 정의
const ResultSection = styled.div`
  margin: 30px 0;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    margin: 25px 0;
  }

  @media (max-width: 425px) {
    margin: 20px 0;
  }

  @media (max-width: 375px) {
    margin: 15px 0;
  }

  @media (max-width: 320px) {
    margin: 10px 0;
  }
`;

const SectionIcon = styled.span`
  font-size: 24px;
  margin-right: 10px;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 425px) {
    font-size: 20px;
  }

  @media (max-width: 375px) {
    font-size: 18px;
  }

  @media (max-width: 320px) {
    font-size: 16px;
  }
`;

const SectionTitle = styled.h3`
  padding: 20px;
  margin: 0;
  background: #1D2636;
  color: white;
  border-radius: 15px 15px 0 0;
  font-size: 20px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 18px;
    font-size: 18px;
  }

  @media (max-width: 425px) {
    padding: 16px;
    font-size: 17px;
  }

  @media (max-width: 375px) {
    padding: 14px;
    font-size: 16px;
  }

  @media (max-width: 320px) {
    padding: 12px;
    font-size: 15px;
  }
`;

const SectionContent = styled.div`
  padding: 25px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0 0 15px 15px;
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 22px;
  }

  @media (max-width: 425px) {
    padding: 20px;
  }

  @media (max-width: 375px) {
    padding: 18px;
  }

  @media (max-width: 320px) {
    padding: 15px;
  }
`;

const CautionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 425px) {
    gap: 10px;
  }

  @media (max-width: 375px) {
    gap: 8px;
  }

  @media (max-width: 320px) {
    gap: 6px;
  }
`;

const CautionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  background: #fff4e5;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    gap: 10px;
    padding: 13px;
  }

  @media (max-width: 425px) {
    gap: 8px;
    padding: 12px;
  }

  @media (max-width: 375px) {
    gap: 6px;
    padding: 10px;
  }

  @media (max-width: 320px) {
    gap: 4px;
    padding: 8px;
  }
`;

const CautionIcon = styled.span`
  font-size: 20px;
  color: #ff9800;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 425px) {
    font-size: 16px;
  }

  @media (max-width: 375px) {
    font-size: 15px;
  }

  @media (max-width: 320px) {
    font-size: 14px;
  }
`;

const CautionText = styled.p`
  margin: 0;
  color: #333;
  line-height: 1.5;
  font-size: 15px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 425px) {
    font-size: 13px;
  }

  @media (max-width: 375px) {
    font-size: 12px;
  }

  @media (max-width: 320px) {
    font-size: 11px;
  }
`;