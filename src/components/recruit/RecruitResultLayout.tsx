import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import Button from '@common/button/Button';
import RecruitPageHeader from '@recruit/RecruitPageHeader';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

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
    <Header align="center" title={title} subtitle={subtitle} $hasGraphic={!!graphic} />
    {graphic && <Graphic>{graphic}</Graphic>}
    <Content $actionGap={actionGap} $hasGraphic={!!graphic}>
      {children}
    </Content>
    <ActionButton $hasGraphic={!!graphic} onClick={onAction}>
      {actionLabel}
    </ActionButton>
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

const Header = styled(RecruitPageHeader)<{ $hasGraphic: boolean }>`
  ${media.xs} {
    ${(props) =>
      props.$hasGraphic &&
      css`
        gap: 24px;
        padding-top: 72px;

        p:first-child {
          ${typographyCss(Typography.display3.bold)}
        }
      `}
  }
`;

const Graphic = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 240px;
  margin-top: 40px;

  ${media.xs} {
    width: 185.391px;
    height: 185.391px;
    margin-top: 88px;

    svg {
      width: 121.64px;
      height: 146.375px;
    }
  }
`;

const Content = styled.div<{ $actionGap: number; $hasGraphic: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: ${(props) => (props.$hasGraphic ? 40 : 58)}px 0 ${(props) => props.$actionGap}px;

  ${media.xs} {
    margin: ${(props) => (props.$hasGraphic ? 36 : 52)}px 0;
  }
`;

const ActionButton = styled(Button)<{ $hasGraphic: boolean }>`
  ${media.xs} {
    ${(props) =>
      !props.$hasGraphic &&
      css`
        padding: 9px 20px;
        border-radius: 10px;
        ${typographyCss(Typography.body2Normal.bold)}
      `}
  }
`;
