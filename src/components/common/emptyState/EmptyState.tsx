import { ReactNode } from 'react';
import { IcCircleExclamation, IcFailure } from '@assets/svg';
import { CoolNeutral, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import styled from 'styled-components';

export type EmptyStateVariant = 'empty' | 'error';

export interface EmptyStateProps {
  /** 쓰이는 자리에 맞춰 높이 등을 조정할 수 있도록 styled()로 감쌀 때 사용 */
  className?: string;
  variant?: EmptyStateVariant;
  icon?: ReactNode;
  message?: string;
}

const DEFAULT_ICON: Record<EmptyStateVariant, ReactNode> = {
  empty: <IcCircleExclamation width={64} height={64} />,
  error: <IcFailure width={64} height={64} />,
};

const DEFAULT_MESSAGE: Record<EmptyStateVariant, string> = {
  empty: '데이터가 없습니다.',
  error: '정보 불러오기를 실패했어요.',
};

const EmptyState = ({ className, variant = 'empty', icon, message }: EmptyStateProps) => {
  return (
    <Wrapper className={className}>
      <IconWrapper>{icon ?? DEFAULT_ICON[variant]}</IconWrapper>
      <Message>{message ?? DEFAULT_MESSAGE[variant]}</Message>
    </Wrapper>
  );
};

export default EmptyState;

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
