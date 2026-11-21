import { ReactNode } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import PageHeader from '@common/pageHeader/PageHeader';
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
    <Header align="center" title={title} subtitle={subtitle} />
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

// 모바일 상단 여백 72px + 레이아웃 여백 8px(68px - 모바일 내비게이션 60px) = Figma 80px
const Header = styled(PageHeader)`
  word-break: keep-all;

  ${media.xs} {
    padding-top: 72px;

    p:first-child {
      ${typographyCss(Typography.display3.bold)}
    }

    p:last-child {
      ${typographyCss(Typography.headline1.medium)}
    }
  }
`;

// 모바일은 그래픽 칸과 그림을 웹의 0.7725배(240px → 185.391px)로 줄인다
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
    ${(props) => props.$hasGraphic && 'margin: 36px 0;'}
  }
`;
