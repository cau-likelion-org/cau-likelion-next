import styled from 'styled-components';
import loadingPic from '@image/loading.png';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NavBar from '@common/header/NavBar';
import MobileNavBar from '@common/header/MobileNavBar';

const Loading = () => {
  return (
    <>
      <DontTouch>
        <NavBar />
        <MobileNavBar />
      </DontTouch>
      <Wrapper>
        <ImagesWrapper>
          <ImageWrapper animate={{ rotate: 360, transition: { duration: 1, repeat: Infinity, repeatDelay: 3 } }}>
            <Image src={loadingPic} layout="fill" objectFit="cover" objectPosition="center" alt="이미지" />
          </ImageWrapper>
          <ImageWrapper
            animate={{ rotate: 360, transition: { duration: 1, delay: 1, repeat: Infinity, repeatDelay: 3 } }}
          >
            <Image src={loadingPic} layout="fill" objectFit="cover" objectPosition="center" alt="이미지" />
          </ImageWrapper>
          <ImageWrapper
            animate={{ rotate: 360, transition: { duration: 1, delay: 2, repeat: Infinity, repeatDelay: 3 } }}
          >
            <Image src={loadingPic} layout="fill" objectFit="cover" objectPosition="center" alt="이미지" />
          </ImageWrapper>
        </ImagesWrapper>
      </Wrapper>
    </>
  );
};

export default Loading;
const Wrapper = styled.div`
  background-color: white;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const DontTouch = styled.div`
  z-index: 999;
`;
const ImageWrapper = styled(motion.div)`
  position: relative;
  width: 4vw;
  height: 4vw;
  margin-left: 4.5px;
  margin-right: 4.5px;
  @media (max-width: 900px) {
    width: 100px;
    height: 100px;
  }
`;
const ImagesWrapper = styled.div`
  position: absolute;
  top: 50%;
  display: flex;
  height: 100%;
  @media (max-width: 900px) {
    top: 40%;
  }
`;
