import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { isUnfilled } from '@utils/index';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface LandingMetrics {
  generationCount: string;
  graduateCount: string;
  projectCount: string;
}

// 숫자 뒤에 "+"만 선택적으로 허용 (예: "230+")
const NUMERIC_WITH_PLUS_REGEX = /^[0-9]+\+?$/;

const isCountInvalid = (value: string) => isUnfilled(value) || !NUMERIC_WITH_PLUS_REGEX.test(value);

export const isMetricsInvalid = (metrics: LandingMetrics) =>
  isUnfilled(metrics.generationCount) || isCountInvalid(metrics.graduateCount) || isCountInvalid(metrics.projectCount);

const IntroduceSection = ({
  metrics,
  onChange,
  showErrors,
  disabled = false,
}: {
  metrics: LandingMetrics;
  onChange: (metrics: LandingMetrics) => void;
  showErrors: boolean;
  disabled?: boolean;
}) => {
  return (
    <Section>
      <Title>중앙대학교 멋쟁이사자처럼</Title>
      <Card>
        <FieldWrapper>
          <TextField
            heading="누적 활동 기수"
            value={metrics.generationCount}
            readOnly={disabled}
            onChange={(event) => onChange({ ...metrics, generationCount: event.target.value })}
            status={showErrors && isUnfilled(metrics.generationCount) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(metrics.generationCount) ? '기수를 입력해 주세요.' : undefined}
          />
        </FieldWrapper>
        <FieldWrapper>
          <TextField
            heading="누적 수료자 수"
            value={metrics.graduateCount}
            readOnly={disabled}
            onChange={(event) => onChange({ ...metrics, graduateCount: event.target.value })}
            status={showErrors && isCountInvalid(metrics.graduateCount) ? 'negative' : 'normal'}
            description={
              showErrors && isCountInvalid(metrics.graduateCount) ? '숫자로 입력해 주세요. (예: 230+)' : undefined
            }
          />
        </FieldWrapper>
        <FieldWrapper>
          <TextField
            heading="누적 프로젝트 개수"
            value={metrics.projectCount}
            readOnly={disabled}
            onChange={(event) => onChange({ ...metrics, projectCount: event.target.value })}
            status={showErrors && isCountInvalid(metrics.projectCount) ? 'negative' : 'normal'}
            description={
              showErrors && isCountInvalid(metrics.projectCount) ? '숫자로 입력해 주세요. (예: 60+)' : undefined
            }
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
