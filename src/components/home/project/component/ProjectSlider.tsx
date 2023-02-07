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
`;
const RelativeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
`;
const Right = styled(TfiAngleRight)`
  cursor: pointer;
`;
const Left = styled.div`
  cursor: pointer;
`;
