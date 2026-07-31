import styled from 'styled-components';

import { IcKakaotalk, IcInstagram, IcEmail } from '@assets/svg';
import { BackgroundLight, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import LikelionCAULogo from 'src/assets/svg/logo/logo-likelion-chungang.svg';

const SOCIAL_LINKS = [
  { icon: IcKakaotalk, href: '#' },
  { icon: IcInstagram, href: '#' },
  { icon: IcEmail, href: '#' },
];

const Footer = ({ isLandingLayout }: { isLandingLayout: boolean }) => {
  return (
    <Wrapper isLandingLayout={isLandingLayout}>
      <Container>
        <Main>
          <LikelionCAULogo width={220} height={20} aria-label="로고 이미지" />
          <List>
            <span>중앙대학교</span>
            <VerticalDivider />
            <span>멋쟁이사자처럼</span>
          </List>
          <HorizontalDivider />
          <Content>
            <Copyright>© 2026 CAU LIKELION. All rights reserved</Copyright>
            <Action>
              {SOCIAL_LINKS.map(({ icon: Icon, href }, index) => (
                <IconButton key={index} href={href} target="_blank" rel="noopener noreferrer">
                  <Icon width={20} height={20} />
                </IconButton>
              ))}
            </Action>
          </Content>
        </Main>
      </Container>
    </Wrapper>
  );
};

export default Footer;

const Wrapper = styled.div<{ isLandingLayout: boolean }>`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${BackgroundLight.secondary};
  box-shadow: inset 0 1px 0 0 ${Line.subtle};
  @media (min-width: 900px) {
    scroll-snap-align: ${(props) => props.isLandingLayout && 'end'};
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 40px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Main = styled.div`
  width: 100%;
  max-width: 1100px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
  ${typographyCss({ ...Typography.label2.bold, fontWeight: 500 })}
  color: ${Label.alternative};
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 18px;
  background-color: ${Line.normal};
`;

const HorizontalDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${Line.subtle};
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Copyright = styled.p`
  ${typographyCss({ ...Typography.label2.bold, fontWeight: 500 })}
  color: ${Label.alternative};
  margin: 0;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
