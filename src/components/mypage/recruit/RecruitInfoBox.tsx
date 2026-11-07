import { ReactNode } from 'react';
import styled from 'styled-components';

import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface RecruitInfoBoxProps {
  title: string;
  children: ReactNode;
}

const RecruitInfoBox = ({ title, children }: RecruitInfoBoxProps) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default RecruitInfoBox;

export const InfoText = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 18px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;
