import { ReactNode } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import PageHeader from '@common/pageHeader/PageHeader';

export interface RecruitResultLayoutProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionGap: number;
  graphic?: ReactNode;
  onAction: () => void;
  children: ReactNode;
}

const RecruitResultLayout = ({
  title,
  subtitle,
  actionLabel,
  actionGap,
  graphic,
  onAction,
  children,
}: RecruitResultLayoutProps) => (
  <Root>
    <PageHeader align="center" title={title} subtitle={subtitle} />
    {graphic && <Graphic>{graphic}</Graphic>}
    <Content $actionGap={actionGap} $hasGraphic={!!graphic}>
      {children}
    </Content>
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

const Graphic = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 240px;
  margin-top: 40px;
`;

const Content = styled.div<{ $actionGap: number; $hasGraphic: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: ${(props) => (props.$hasGraphic ? 40 : 58)}px 0 ${(props) => props.$actionGap}px;
`;
