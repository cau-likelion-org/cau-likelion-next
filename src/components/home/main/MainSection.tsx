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
  '중앙대학교 멋쟁이사자처럼은 중앙대 학생들로 이루어진 IT 창업 동아리입니다\n아이디어를 현실로 만들고, 세계를 향한 첫 발자국을 멋쟁이사자처럼에서 내딛어보세요';

const MOBILE_DESCRIPTION =
  '중앙대학교 멋쟁이사자처럼은 중앙대 학생들로 이루어진\nIT 창업 동아리입니다 아이디어를 현실로 만들고,\n세계를 향한 첫 발자국을 멋쟁이사자처럼에서 내딛어보세요';

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

// 좌우로 화면을 넘치도록 놓인 장식 일러스트. 375px 기준 left -288.7px를 화면 중앙 기준 오프셋으로 환산해 고정한다
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
    /* 배경 일러스트 위로 올린다 */
    position: relative;
    z-index: 1;
    left: auto;
    top: auto;
    width: 100%;
    /* MobileNavBar가 position: fixed(60px)라 자리를 차지하지 않으므로 60px + 디자인 여백 53px */
    padding: 113px 20px 0;
    gap: 22px;
  }
`;

const TopGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 36px;

  /* align-items: flex-start인 부모 안에서는 로고 원본 너비(694px)로 늘어나므로 명시적으로 채운다 */
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
    /* 원본(694px)보다 커지지는 않게 한다 */
    max-width: 694px;
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

// size prop은 CSS로 덮을 수 없어서 데스크톱/모바일 버튼을 따로 둔다
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
