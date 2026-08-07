import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface LandingMetrics {
  generationCount: string;
  graduateCount: string;
  projectCount: string;
}

const IntroduceSection = ({
  metrics,
  onChange,
}: {
  metrics: LandingMetrics;
  onChange: (metrics: LandingMetrics) => void;
}) => {
  return (
    <Section>
      <Title>중앙대학교 멋쟁이사자처럼</Title>
      <Card>
        <FieldWrapper>
          <TextField
            heading="누적 활동 기수"
            value={metrics.generationCount}
            onChange={(event) => onChange({ ...metrics, generationCount: event.target.value })}
          />
        </FieldWrapper>
        <FieldWrapper>
          <TextField
            heading="누적 수료자 수"
            value={metrics.graduateCount}
            onChange={(event) => onChange({ ...metrics, graduateCount: event.target.value })}
          />
        </FieldWrapper>
        <FieldWrapper>
          <TextField
            heading="누적 프로젝트 개수"
            value={metrics.projectCount}
            onChange={(event) => onChange({ ...metrics, projectCount: event.target.value })}
          />
        </FieldWrapper>
      </Card>
    </Section>
  );
};

export default IntroduceSection;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
`;

const FieldWrapper = styled.div`
  flex: 0 0 160px;
`;
