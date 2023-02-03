import styled from 'styled-components';
import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';
import projectPic from '@image/projectPic.png';
import projectPic2 from '@image/projectPic2.png';
import Image, { StaticImageData } from 'next/image';
import { GreyScale } from '@utils/constant/color';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
interface IProject {
  name: string;
  introduce: string;
  teamName: string;
  projectType: string;
  img: StaticImageData;
}
const ProjectData: IProject[] = [
  {
    name: '프로젝트명',
    introduce:
      '트랙별 아기사자들이 멋쟁이 사자처럼 활동을 통해 다양하고 재미있는 프로젝트를 만들었습니다~~어쩌구트랙별아기사자들이 멋쟁이 사자처럼 활동을 통해 다양하고 재미있는 프로젝트를 만들었습니다~~어쩌구트랙별아기사자들이 멋쟁이 사자처럼 활동을 통해 다양하고 재미있는 프로젝트를 만들었습니다~~어쩌구',
    teamName: '개구리팀',
    projectType: '2022 아이디어톤',
    img: projectPic,
  },
  {
    name: '프로젝트명',
    introduce: '',
    teamName: '',
    projectType: '',
    img: projectPic2,
  },
];

const AnimationVariant = {
  initial: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      scale: 0,
      opacity: 0,
      transition: {
        duration: 1,
      },
    };
  },
  visible: {
    x: 0,
    scale: 1,
    opacity: 1,
    transition: {
        duration: 1,
      },
  },
  exit: (direction: number) => {
    return {
      scale: 0,
      opacity: 0,
      x: direction < 0 ? 1000 : -1000,
      transition: {
        duration: 1,
      },
    };
  },
};

const ProjectSlider = () => {
  const [[index, direction], setIndex] = useState([0, 0]);
  const indexIncrease = () => {
    setIndex((prev) => (prev[0] > ProjectData.length - 2 ? [0, +1] : [index + 1, +1]));
  };
  const indexDecrease = () => {
    setIndex((prev) => (prev[0] < 1 ? [ProjectData.length - 1, -1] : [index - 1, -1]));
  };

  return (
    <Wrapper>
      <TfiAngleLeft size={30} onClick={indexDecrease} />
      <RelativeWrapper>
        <AnimatePresence initial={false} custom={direction}>
          <ProjectWrapper
            variants={AnimationVariant}
            initial="initial"
            animate="visible"
            exit="exit"
            key={ProjectData[index].introduce}
            custom={direction}
          >
            <ImageWrapper>
              <ImageComponent
                src={ProjectData[index].img}
                width={483}
                height={295}
                alt="img"
                layout="fill"
                objectFit="fill"
                objectPosition="center"
              />
            </ImageWrapper>
            <ProjectInfo>
              <TextWrapper>
                <ProjectTitle>{ProjectData[index].name}</ProjectTitle>
                <ProjectText>{ProjectData[index].introduce}</ProjectText>
                <TeamInfo>
                  <TeamName>{ProjectData[index].teamName}</TeamName>
                  <ProjectType>{ProjectData[index].projectType}</ProjectType>
                </TeamInfo>
              </TextWrapper>
            </ProjectInfo>
          </ProjectWrapper>
        </AnimatePresence>
      </RelativeWrapper>
      <TfiAngleRight size={30} onClick={indexIncrease} />
    </Wrapper>
  );
};

export default ProjectSlider;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const RelativeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
`;
const ProjectWrapper = styled(motion.div)`
  position: absolute;
  width: 90%;
  display: flex;
  height: 300px;
  margin-left: 4%;
  margin-right: 4%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;
const ImageWrapper = styled.div`
  position: relative;
  object-fit: cover;
  flex-basis: 40%;
`;
const ImageComponent = styled(Image)`
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
`;
const ProjectInfo = styled.div`
  background: #f0f1ff;
  flex-basis: 60%;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
`;
const ProjectTitle = styled.div`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 3rem;
`;
const ProjectText = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.7rem;
  line-height: 160%;
  margin: 15px 0px;
`;
const TextWrapper = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`;
const TeamName = styled.div`
  color: ${GreyScale.default};
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  margin-right: 15px;
`;
const ProjectType = styled(TeamName)``;
const TeamInfo = styled.div`
  display: flex;
`;
