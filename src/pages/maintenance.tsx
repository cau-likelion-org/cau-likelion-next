import { ReactElement } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
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
            <ImageWrapper key={i} delay={i}>
              <Image src={loadingPic} layout="fill" objectFit="cover" objectPosition="center" alt="멋쟁이사자" />
            </ImageWrapper>
          ))}
        </LionWrapper>

        <Badge>UNDER RENEWAL</Badge>

        <Title>
          <BlueBlockText>사이트</BlueBlockText>
          <WhiteBlockText>리뉴얼 중</WhiteBlockText>
        </Title>

        <Description>
          더 나은 모습으로 찾아뵙기 위해 잠시 점검하고 있어요
          <DotWrapper>
            {Array.from({ length: 3 }).map((_, i) => (
              <Dot key={i} delay={i} />
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

const spin = keyframes`
  0% { transform: rotate(0deg); }
  30% { transform: rotate(360deg); }
  100% { transform: rotate(360deg); }
`;

const ImageWrapper = styled.div<{ delay: number }>`
  position: relative;
  width: 6rem;
  height: 6rem;
  margin-left: 4.5px;
  margin-right: 4.5px;
  animation: ${spin} 4s ease-in-out ${({ delay }) => delay}s infinite;

  @media (max-width: 750px) {
    width: 4rem;
    height: 4rem;
  }
`;

const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Badge = styled.div`
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
  animation: ${fadeInDown} 0.5s ease-out both;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  animation: ${fadeInUp} 0.6s ease-out 0.15s both;
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

const Description = styled.p`
  display: flex;
  align-items: center;
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 18px;
  color: ${GreyScale.default};
  margin-top: 2rem;
  z-index: 1;
  animation: ${fadeInUp} 0.6s ease-out 0.3s both;
`;

const DotWrapper = styled.span`
  display: inline-flex;
  gap: 4px;
  margin-left: 4px;
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
`;

const Dot = styled.span<{ delay: number }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${Primary.default};
  animation: ${pulse} 1.2s ease-in-out ${({ delay }) => delay * 0.2}s infinite;
`;
