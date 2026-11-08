import { ReactNode } from 'react';
import styled from 'styled-components';

import { Black, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface ApplyFieldHeadingProps {
  title: string;
  required?: boolean;
  trailing?: ReactNode;
}

// 공통 입력 컴포넌트 밖에서 쓰는 지원서 입력칸 제목 (파일·면접 시간·선택지 등)
const ApplyFieldHeading = ({ title, required = false, trailing }: ApplyFieldHeadingProps) => (
  <Row>
    <Heading>
      <Title>{title}</Title>
      {required && <Required>*</Required>}
    </Heading>
    {trailing}
  </Row>
);

export default ApplyFieldHeading;

const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Title = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.heading1.bold)}
`;

const Required = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.label1Normal.medium)}
`;
