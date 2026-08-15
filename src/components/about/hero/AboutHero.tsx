import styled from 'styled-components';

import PageHeader from '@common/pageHeader/PageHeader';
import { Black, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import IllustBack from '@assets/svg/illustration/illust-about-hero-back.svg';
import IllustBackMobile from '@assets/svg/illustration/illust-about-hero-back-mobile.svg';
import IllustLeft from '@assets/svg/illustration/illust-about-hero-left.svg';
import IllustRight from '@assets/svg/illustration/illust-about-hero-right.svg';
import IllustRightSmall from '@assets/svg/illustration/illust-about-hero-right-small.svg';

// 시안 기준 폭. 일러스트는 이 폭을 기준으로 한 절대 좌표를 그대로 사용한다
const STAGE_WIDTH = 1440;
const GROUND_HEIGHT = 22.05;
const MOBILE = 700;

const AboutHero = () => {
  return (
    <Wrapper>
      <Stage aria-hidden>
        <Back />
      </Stage>
      <BackMobile aria-hidden />
      <Header
        align="center"
        title="중앙대학교 멋쟁이사자처럼"
        subtitle={
          <>
            아이디어를 현실로 만드는 IT 창업 동아리, 중앙대학교 멋쟁이사자처럼입니다.
            <br />
            기획, 디자인, 개발 파트가 함께 소통하며 우리만의 서비스를 세상에 내놓는 경험을 쌓아갑니다.
          </>
        }
      />
      <Ground aria-hidden />
      <Stage aria-hidden>
        <Left />
        <Right />
        <RightSmall />
      </Stage>
    </Wrapper>
  );
};

export default AboutHero;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: ${Orange.o100};
`;

const Stage = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: ${STAGE_WIDTH}px;
  height: 100%;

  @media (max-width: ${MOBILE}px) {
    display: none;
  }
`;

const Header = styled(PageHeader)`
  position: relative;
  z-index: 1;
  gap: 32px;
  padding-bottom: 80px;
  padding-left: 20px;
  padding-right: 20px;

  p {
    color: ${Black.b900};
  }

  @media (max-width: ${MOBILE}px) {
    gap: 18px;
    padding-top: 43px;
    padding-bottom: 43px;

    p {
      color: ${Orange.o500};
    }

    /* PageHeader는 900px 이하에서 타이틀을 title2로 줄이지만, 모바일 시안은 display2를 유지한다 */
    p:first-of-type {
      ${typographyCss(Typography.display2.bold)}
    }

    p:last-of-type {
      ${typographyCss(Typography.label1Normal.medium)}
    }
  }
`;

const Back = styled(IllustBack)`
  position: absolute;
  top: 17.99px;
  left: 50%;
  transform: translateX(-50%);
  width: 603.92px;
  height: 321.789px;
`;

const BackMobile = styled(IllustBackMobile)`
  display: none;

  @media (max-width: ${MOBILE}px) {
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -11.77px;
    width: 106.13%;
    height: auto;
    aspect-ratio: 397.993 / 212.064;
  }
`;

const Ground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${GROUND_HEIGHT}px;
  background-color: ${Orange.o200};
`;

const Left = styled(IllustLeft)`
  position: absolute;
  bottom: ${GROUND_HEIGHT}px;
  left: 78.19px;
  width: 240.657px;
  height: 103.654px;
`;

const Right = styled(IllustRight)`
  position: absolute;
  bottom: ${GROUND_HEIGHT}px;
  left: 1107.06px;
  width: 94.739px;
  height: 90.941px;
`;

const RightSmall = styled(IllustRightSmall)`
  position: absolute;
  bottom: ${GROUND_HEIGHT}px;
  left: 1206.9px;
  width: 59.029px;
  height: 55.922px;
`;
