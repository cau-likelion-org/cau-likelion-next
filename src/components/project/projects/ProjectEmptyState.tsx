import { ReactNode } from 'react';
import { IcCircleExclamation } from '@assets/svg';
import { CoolNeutral, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import styled from 'styled-components';

interface ProjectEmptyStateProps {
  icon?: ReactNode;
  message?: string;
}

const ProjectEmptyState = ({
  icon = <IcCircleExclamation width={64} height={64} />,
  message = '조건에 맞는 프로젝트가 없습니다.',
}: ProjectEmptyStateProps) => {
  return (
    <Wrapper>
      <IconWrapper>{icon}</IconWrapper>
      <Message>{message}</Message>
    </Wrapper>
  );
};

export default ProjectEmptyState;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  width: 100%;
  min-height: 468px;
  padding: 10px;

  @media (max-width: 600px) {
    min-height: auto;
    padding: 100px 10px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  color: ${CoolNeutral.neutral70};
`;

const Message = styled.p`
  margin: 0;
  color: ${Label.alternative};
  text-align: center;
  ${typographyCss(Typography.body1Normal.medium)}
`;
