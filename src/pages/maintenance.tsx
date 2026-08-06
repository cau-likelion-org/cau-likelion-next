import { ReactElement } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import loadingPic from '@image/loading.png';
import { Primary, Secondary, GreyScale, BackgroundColor } from '@utils/constant/color';

const Maintenance = () => {
  return (
    <>
      <Head>
        <title>사이트 점검 중 | LikeLionCAU</title>
      </Head>
      <Wrapper>
        <BlobBlue aria-hidden />
        <BlobOrange aria-hidden />

        <LionWrapper>
          {Array.from({ length: 3 }).map((_, i) => (
            <ImageWrapper key={i} animate={animationSetting(i)}>
              <Image src={loadingPic} layout="fill" objectFit="cover" objectPosition="center" alt="멋쟁이사자" />
            </ImageWrapper>
          ))}
        </LionWrapper>

        <Badge
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          UNDER RENEWAL
        </Badge>

        <Title
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <BlueBlockText>사이트</BlueBlockText>
          <WhiteBlockText>리뉴얼 중</WhiteBlockText>
        </Title>

        <Description
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          더 나은 모습으로 찾아뵙기 위해 잠시 점검하고 있어요
          <DotWrapper>
            {Array.from({ length: 3 }).map((_, i) => (
              <Dot
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </DotWrapper>
        </Description>
      </Wrapper>
    </>
  );
};

export default Maintenance;

Maintenance.getLayout = function getLayout(page: ReactElement) {
  return page;
};

const animationSetting = (i: number) => {
  return {
    rotate: 360,
    transition: {
      duration: 1,
      delay: i,
      repeat: Infinity,
      repeatDelay: 3,
    },
  };
};

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  padding: 0 20px;
  text-align: center;

  background: radial-gradient(circle at 50% 35%, ${Primary.light} 0%, ${BackgroundColor} 65%);
`;

const driftBlue = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(3rem, 2rem) scale(1.15); }
`;

const driftOrange = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-2.5rem, -2rem) scale(1.1); }
`;

const BlobBlue = styled.div`
  position: absolute;
  top: -12rem;
  right: -10rem;
  width: 34rem;
  height: 34rem;
  border-radius: 50%;
  background: ${Primary.default};
  opacity: 0.18;
  filter: blur(90px);
  pointer-events: none;
  animation: ${driftBlue} 10s ease-in-out infinite;

  @media (max-width: 750px) {
    width: 18rem;
    height: 18rem;
    top: -6rem;
    right: -6rem;
  }
`;

const BlobOrange = styled.div`
  position: absolute;
  bottom: -10rem;
  left: -8rem;
  width: 26rem;
  height: 26rem;
  border-radius: 50%;
  background: ${Secondary.default};
  opacity: 0.14;
  filter: blur(90px);
  pointer-events: none;
  animation: ${driftOrange} 12s ease-in-out infinite;

  @media (max-width: 750px) {
    width: 14rem;
    height: 14rem;
    bottom: -5rem;
    left: -4rem;
  }
`;

const LionWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 9px;
  margin-bottom: 3rem;
  z-index: 1;
`;

const ImageWrapper = styled(motion.div)`
  position: relative;
  width: 6rem;
  height: 6rem;
  margin-left: 4.5px;
  margin-right: 4.5px;

  @media (max-width: 750px) {
    width: 4rem;
    height: 4rem;
  }
`;

const Badge = styled(motion.div)`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: ${Secondary.default};

  padding: 6px 16px;
  margin-bottom: 1.2rem;
  border: 1.5px solid ${Secondary.default};
  border-radius: 999px;
  z-index: 1;
`;

const Title = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const BlueBlockText = styled.div`
  font-family: 'Gmarket Sans';
  font-weight: 700;
  font-size: 6rem;
  color: ${Primary.default};
  line-height: 1.1;

  @media (max-width: 750px) {
    font-size: 3rem;
  }
`;

const WhiteBlockText = styled(BlueBlockText)`
  color: white;
  text-shadow: -1px -1px 0 ${Primary.default}, 1px -1px 0 ${Primary.default}, -1px 1px 0 ${Primary.default},
    1px 1px 0 ${Primary.default};
`;

const Description = styled(motion.p)`
  display: flex;
  align-items: center;
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 18px;
  color: ${GreyScale.default};
  margin-top: 2rem;
  z-index: 1;
`;

const DotWrapper = styled.span`
  display: inline-flex;
  gap: 4px;
  margin-left: 4px;
`;

const Dot = styled(motion.span)`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${Primary.default};
`;
