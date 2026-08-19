import styled from 'styled-components';
import { HiOutlineBell } from 'react-icons/hi';
import Button from '@common/button/Button';
import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import BgLanding from 'src/assets/svg/bg-landing.svg';
import BgLandingMobile from 'src/assets/svg/bg-landing-mobile.svg';
import LogoLikelion from 'src/assets/svg/logo/logo-likelion.svg';
import LogoX from 'src/assets/svg/logo/logo-x.svg';
import LogoCAU from 'src/assets/svg/logo/logo-cau.svg';
import LogoCatchphrase from 'src/assets/svg/logo/logo-catchphrase.svg';
import useRecruitModalStore from 'src/store/useRecruitModalStore';
import { MOBILE } from '@home/common/responsive';

const DESCRIPTION =
  '중앙대학교 멋쟁이사자처럼은 중앙대학교 학생들로 구성된 IT 창업 동아리입니다.\n세상에 필요한 아이디어를 현실로 만들 첫 발자국을 멋쟁이사자처럼에서 내딛어보세요.';

const MOBILE_DESCRIPTION =
  '중앙대학교 멋쟁이사자처럼은\n중앙대학교 학생들로 구성된 IT 창업 동아리입니다.\n세상에 필요한 아이디어를 현실로 만들\n첫 발자국을 멋쟁이사자처럼에서 내딛어보세요.';

const BUTTON_LABEL = '다음 기수 모집 알림받기';

const MainSection = () => {
  const openRecruitModal = useRecruitModalStore((state) => state.openNotifyModal);

  return (
    <Wrapper>
      <DesktopBg width={1440} height={666} aria-label="배경 이미지" />
      <MobileBg aria-label="배경 이미지" />

      <Content>
        <TopGroup>
          <LogoRow>
            <LogoLikelion />
            <LogoX />
            <LogoCAU />
          </LogoRow>
          <Catchphrase />
        </TopGroup>

        <DesktopGroup>
          <Description>{DESCRIPTION}</Description>
          <Button
            variant="solid"
            color="assistive"
            size="large"
            trailingIcon={<HiOutlineBell />}
            onClick={openRecruitModal}
          >
            {BUTTON_LABEL}
          </Button>
        </DesktopGroup>

        <MobileGroup>
          <Description>{MOBILE_DESCRIPTION}</Description>
          <Button
            variant="solid"
            color="assistive"
            size="small"
            trailingIcon={<HiOutlineBell />}
            onClick={openRecruitModal}
          >
            {BUTTON_LABEL}
          </Button>
        </MobileGroup>
      </Content>
    </Wrapper>
  );
};

export default MainSection;

const Wrapper = styled.div`
  position: relative;
  width: 1440px;
  padding-top: 209px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;

  @media (max-width: ${MOBILE}px) {
    width: 100%;
    height: 652px;
    padding-top: 0;
    align-items: flex-start;
    justify-content: flex-start;
    overflow: hidden;
  }
`;

const DesktopBg = styled(BgLanding)`
  @media (max-width: ${MOBILE}px) {
    display: none;
  }
`;

const MobileBg = styled(BgLandingMobile)`
  display: none;

  @media (max-width: ${MOBILE}px) {
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -476px;
    width: 756px;
    height: auto;
  }
`;

const Content = styled.div`
  position: absolute;
  left: 190px;
  top: 114px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 77px;

  @media (max-width: ${MOBILE}px) {
    position: relative;
    z-index: 1;
    left: auto;
    top: auto;
    width: 100%;
    padding: 113px 20px 0;
    gap: 22px;
  }
`;

const TopGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 36px;

  @media (max-width: ${MOBILE}px) {
    width: 100%;
    gap: 0;
  }
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: ${MOBILE}px) {
    display: none;
  }
`;

const Catchphrase = styled(LogoCatchphrase)`
  @media (max-width: ${MOBILE}px) {
    width: 100%;
    max-width: 335px;
    height: auto;
  }
`;

const Description = styled.p`
  ${typographyCss(Typography.body1Normal.medium)}
  color: ${Black.b70};
  white-space: pre-line;
  margin: 0;

  @media (max-width: ${MOBILE}px) {
    ${typographyCss(Typography.caption2.regular)}
  }
`;

const DesktopGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;

  @media (max-width: ${MOBILE}px) {
    display: none;
  }
`;

const MobileGroup = styled.div`
  display: none;

  @media (max-width: ${MOBILE}px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 22px;
    width: 100%;
  }
`;
