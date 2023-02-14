import { AnimatePresence, motion, Variants } from 'framer-motion';
import styled from 'styled-components';
import Image from 'next/image';

import { GreyScale } from '@utils/constant/color';

import { IProjectInner } from './ProjectSlider';

const Project = ({
  ProjectData,
  direction,
  animationVaraints,
}: {
  ProjectData: IProjectInner;
  direction: number;
  animationVaraints: Variants;
}) => {
  return (
    <AnimatePresence initial={false} custom={direction}>
      <ProjectWrapper
        variants={animationVaraints}
        initial="initial"
        animate="visible"
        exit="exit"
        key={ProjectData.introduce}
        custom={direction}
      >
        <ImageWrapper>
          <ImageComponent
            src={ProjectData.img}
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
            <ProjectTitle>{ProjectData.name}</ProjectTitle>
            <ProjectText>{ProjectData.introduce}</ProjectText>
            <TeamInfo>
              <TeamName>{ProjectData.teamName}</TeamName>
              <ProjectType>{ProjectData.projectType}</ProjectType>
            </TeamInfo>
          </TextWrapper>
        </ProjectInfo>
      </ProjectWrapper>
    </AnimatePresence>
  );
};

export default Project;

const ProjectWrapper = styled(motion.div)`
  position: absolute;
  width: 93%;
  display: flex;
  height: 300px;
  margin-left: 4%;
  margin-right: 4%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  @media (max-width: 900px) {
    height: 150px;
  }
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
  @media (max-width: 900px) {
    font-size: 2rem;
  }
`;
const ProjectText = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.7rem;
  margin: 15px 0px;
  @media (max-width: 900px) {
    font-size: 1rem;
  }
`;
const TextWrapper = styled.div`
  padding: 3rem;
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
