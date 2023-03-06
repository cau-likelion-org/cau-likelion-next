import Image from 'next/image';
import union from '@image/union.png';
import generationDia from '@image/generationDia.png';
import circle from '@image/circle.png';
import loadingPic from '@image/loading.png';
import styled from 'styled-components';
import { Primary } from '@utils/constant/color';
import LandingRectangle from '@image/landingRectangle.svg';
import { motion } from 'framer-motion';
import { HiOutlineArrowDown } from 'react-icons/hi';
import { GENERATION_CHECKER } from '@utils/constant';

const MainSection = ({ clickMore }: { clickMore: () => void; }) => {
  const generation = new Date().getFullYear() - GENERATION_CHECKER;

  return (
    <Wrapper>
      <MainWrapper>
        <LeftSection>
          <LionWrapper>
            {
              Array.from({ length: 3 }).map(
                (_, i) => (
                  <ImageWrapper key={i} animate={animationSetting(i)}>
                    <Lion key={i} src={loadingPic} layout="fill" objectFit="cover" objectPosition="center" />
                  </ImageWrapper>
                )
              )
            }
          </LionWrapper>
          <TextWrapper>
            <UnionTextWrapper>
              <BlueBlockText>멋쟁이</BlueBlockText>
              <UnionText className='union'><Union src={union} /></UnionText>
            </UnionTextWrapper>
            <BlueBlockText>사자처럼</BlueBlockText>
            <LandingRectangle style={{ 'marginTop': '22px' }} />
            <WhiteBlockText>중앙대학교</WhiteBlockText>
          </TextWrapper>
        </LeftSection>

        <RightSection>
          <ImagesWrapper>
            <GenerationDiaWrapper>
              <GenerationText>{generation}기</GenerationText>
              <GenerationDia src={generationDia} />
            </GenerationDiaWrapper>
            <CircleWrapper className='circle'><Circle src={circle} /></CircleWrapper>
            <UnionRow>
              <UnionWrapper className='union'><Union src={union} /></UnionWrapper>
            </UnionRow>
          </ImagesWrapper>
        </RightSection>
      </MainWrapper>

      <MoreWrapper>
        <Text onClick={clickMore}>더 알아보기</Text>
        <ArrowCircle onClick={clickMore}>
          <HiOutlineArrowDown className='arrow' color={Primary.default} />
        </ArrowCircle>
      </MoreWrapper>
    </Wrapper>
  );
};

export default MainSection;


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  @media (min-width: 900px) {
    scroll-snap-align: start;
    min-height: 70vh;
    height: 100vh;
  }
`;

const MainWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;

  @media (max-width: 900px){
    justify-content: space-between;
  }
`;

const LeftSection = styled.div`
`;

const RightSection = styled.div`
  border: solid 1px black;
`;

const LionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 9px;
  @media (max-width: 900px) {
    gap: 0;
  }
`;

const Lion = styled(Image)``;

const animationSetting = (i: number) => {
  return {
    rotate: 360,
    transition: {
      duration: 1,
      delay: i,
      repeat: Infinity,
      repeatDelay: 3
    }
  };
};

const ImageWrapper = styled(motion.div)`
  position: relative;
  width: 7rem;
  height: 7rem;
  margin-left: 4.5px;
  margin-right: 4.5px;
  @media (max-width: 1440px) {
    width: 5.6rem;
    height: 5.6rem;
  }
  @media (max-width: 900px) {
    width: 4.4rem;
    height: 4.4rem;
  }
  @media (max-width: 750px) {
    width: 3.6rem;
    height: 3.6rem;
  }
  @media (max-width: 524px) {
    width: 2.5rem;
    height: 2.5rem;
  }
  
`;

const ImagesWrapper = styled.div`
  position: absolute; 
  right: 0;
  bottom: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 1920px){
    bottom: 25rem;
  }

  @media (max-width:1440px){
    bottom: 13rem;
  }

  @media (max-width:900px){
    bottom: 10rem;
  }

  @media (max-width: 750px){
    bottom: 19rem;
  }

  @media (max-width: 524px){
    bottom: 19rem;
  }

  @media (max-width: 360px){
    bottom: 16rem;
  }
`;


const GenerationDiaWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19.6rem;
  height: 19.6rem;
  z-index:1;
  margin-bottom: -9.4rem; 

  @media(max-width:1600px){
    width: 15rem;
    height: 15rem;
    margin-bottom: -8rem; 
  }

  @media(max-width:1440px){
    width: 14rem;
    height: 14rem;
    margin-bottom: -8.3rem; 
  }

  @media(max-width:900px){
    width: 13rem;
    height: 13rem;
    margin-bottom: -7rem; 

  }

  @media(max-width:750px){
    width: 9rem;
    height: 9rem;
    margin-bottom: -5rem; 

  }
  
  @media(max-width: 524px){
    width: 7rem;
    height: 7rem;
    margin-bottom: -3.7rem; 

  }

  @media(max-width: 360px){
    width: 6rem;
    height: 6rem;
    margin-bottom: -2.7rem;
  }
  
`;

const CircleWrapper = styled.div`
  width:40rem;
  height:22rem;
  @media(max-width:1280px){
    width: 36rem;
    height: 18rem;
  }

   @media (max-width:900px){
    width: 288px;
    height: 161.8px;
  }
  @media(max-width: 750px){
    width: 21rem;
    height: 12rem;
  }

  @media (max-width: 524px){
    width: 17rem;
    height: 9.5rem;
  }
  @media (max-width: 360px){
    width: 15rem;
    height: 7rem;
  }


`;

const UnionRow = styled.div`
  display: flex;
  width: 80%;
  justify-content: flex-end;
`;

const UnionWrapper = styled.div`
  width:10rem;
  height: 10rem;

  margin-top: -20px;

  @media(max-width:1280px) {
    width: 6rem;
    height: 6rem;
  }

  @media (max-width:900px) {
    width: 5rem;
    height: 5rem;
  }

  @media(max-width:750px){
    width:4rem;
    height: 4rem;
  }
  
  @media(max-width: 524px){
    width: 3rem;
    height: 3rem;
  }

  @media(max-width: 360px){
    width: 3rem;
    height: 3rem;
  }
  
`;

const UnionText = styled.div`
  width: 7rem;
  height: 7rem;
  margin-left: -2.3rem;
  margin-top: -3.5rem;
  rotate: calc(45deg);

  @media (max-width: 750px) {
    width: 6rem;
    height: 6rem;
    margin-left: -2rem;
    margin-top: -3rem;
  }

  @media (max-width: 524px) {
    width: 5rem;
    height: 5rem;
    margin-left: -1.8rem;
    margin-top: -2.5rem;
  }

  @media (max-width: 360px) {
    width: 4rem;
    height: 4rem;
    margin-left: -1.3rem;
    margin-top: -2.2rem;
  }
`;


const GenerationDia = styled(Image)`
  position: absolute;
`;


const Circle = styled(Image)``;
const Union = styled(Image)``;

const GenerationText = styled.div`
  position: absolute;
  z-index:1;
  font-family: 'GmarketSans';
  font-style: normal;
  font-weight: 700;
  font-size: 5rem;
  color:#FFFFFF;

  @media(max-height:1280px){
    font-size: 4rem;
  }

  @media(max-width:900px){
    font-size: 3rem;
  }

  @media(max-width:750px){
    font-size: 2rem;
  }

  @media(max-height:524px){
    font-size: 1.7rem;
  }

  @media(max-width:360px){
    font-size: 1.7rem;
  }

`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BlueBlockText = styled.div`
  font-family: 'GmarketSans';
  font-weight: 700;
  font-size: 13rem;
  color: #1A21BD;
  @media (max-width: 1440px) {
    font-size: 9.5rem;
  }
  @media (max-width: 900px) {
    font-size: 7rem;
  }

  @media (max-width: 360px) {
    font-size: 4rem;
  }
`;

const WhiteBlockText = styled(BlueBlockText)`
  margin-top: 22px;
  color: white;
  text-shadow: -1px -1px 0 ${Primary.default}, 1px -1px 0 ${Primary.default}, -1px 1px 0 ${Primary.default}, 1px 1px 0 ${Primary.default}; 
  
  @media (max-width: 360px) {
    font-size: 4rem;
  }
`;

const UnionTextWrapper = styled.div`
  display: flex;
`;

const MoreWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 2rem 0;
  @media (max-width: 524px) {
    justify-content: center;
  }
  @media (max-width: 360px){
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
`;

const ArrowCircle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    width: 5rem;
    cursor: pointer;

    height: 5rem;
    border: 2px solid ${Primary.default};
    box-shadow: 1rem 1rem 1rem 0rem #2B22784D;
    .arrow{
        width: 3rem;
        height: 3rem;
        @media (max-width: 900px) {
          width: 1.8rem;
          height: 1.8rem;
        }
        @media (max-width: 750px){
          width: 1.3rem;
          height: 1.3rem;
        }
    };
    @media(max-width: 900px){
      width: 3rem;
      height: 3rem;
      box-shadow: 0.4rem 0.4rem 0.4rem 0rem #2B22784D;
    }
    @media(max-width: 750px) {
      width: 2.3rem;
      height: 2.3rem;
      box-shadow: 0.2rem 0.2rem 0.2rem 0rem #2B22784D;
    }


`;

const Text = styled.div`
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-family: 'GmarketSans';
    font-size: 2.3rem;
    color: ${Primary.default};
    font-weight: 700;

    @media (max-width: 900px) {
      font-size: 1.7rem;
    }
`;





