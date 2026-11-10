import { ReactNode } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import PageHeader from '@common/pageHeader/PageHeader';

export interface RecruitResultLayoutProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionGap: number;
  onAction: () => void;
  children: ReactNode;
}

const RecruitResultLayout = ({
  title,
  subtitle,
  actionLabel,
  actionGap,
  onAction,
  children,
}: RecruitResultLayoutProps) => (
  <Root>
    <PageHeader align="center" title={title} subtitle={subtitle} />
    <Content $actionGap={actionGap}>{children}</Content>
    <Button onClick={onAction}>{actionLabel}</Button>
  </Root>
);

export default RecruitResultLayout;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 640px;
`;

const Content = styled.div<{ $actionGap: number }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 58px 0 ${(props) => props.$actionGap}px;
`;
