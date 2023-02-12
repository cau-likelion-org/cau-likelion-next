import styled from 'styled-components';
import { useState } from 'react';
import { StaticImageData } from 'next/image';

import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';
import projectPic from '@image/projectPic.png';
import projectPic2 from '@image/projectPic2.png';

import Project from './Project';

export interface IProjectInner {
  name: string;
  introduce: string;
  teamName: string;
  projectType: string;
  img: StaticImageData;
}
const ProjectData: IProjectInner[] = [
  {
    name: 'Baby Frog',
    introduce:
      '아기 개구리를 살려라! 아기 개구리 살리는 서비스, 개굴개굴 baby frog',
    teamName: '개구리팀',
    projectType: '2022 아이디어톤',
    img: projectPic,
  },
  {
    name: '카모마일 알라쁑',
    introduce: '카모마일, 맥심 커피, 그 중 승자는? 승자를 가려라 서비스, 카모마일',
    teamName: '캠몸맘임',
    projectType: '2022 해커톤',
    img: projectPic2,
  },
];

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
      <Left>
        <TfiAngleLeft size={30} onClick={indexDecrease} />
        {/* 알수 없는 오류로 Left는 pointer:cursor가 안먹음; */}
      </Left>
      <RelativeWrapper>
        <Project ProjectData={ProjectData[index]} direction={direction} />
      </RelativeWrapper>
      <Right size={30} onClick={indexIncrease} />
    </Wrapper>
  );
};

export default ProjectSlider;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
`;
const RelativeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  @media (max-width: 900px) {
    height: 150px;
  }
`;
const Right = styled(TfiAngleRight)`
  cursor: pointer;
`;
const Left = styled.div`
  cursor: pointer;
`;
