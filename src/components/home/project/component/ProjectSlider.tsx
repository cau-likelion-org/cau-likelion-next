import styled from 'styled-components';
<<<<<<< HEAD
=======
import { useState } from 'react';
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
import { StaticImageData } from 'next/image';

import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';
import projectPic from '@image/projectPic.png';
import projectPic2 from '@image/projectPic2.png';

import Project from './Project';
<<<<<<< HEAD
import useSlider from 'src/hooks/useSlider';
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9

export interface IProjectInner {
  name: string;
  introduce: string;
  teamName: string;
  projectType: string;
  img: StaticImageData;
}
const ProjectData: IProjectInner[] = [
  {
<<<<<<< HEAD
    name: 'Baby Frog',
    introduce: '아기 개구리를 살려라! 아기 개구리 살리는 서비스, 개굴개굴 baby frog',
=======
    name: '프로젝트명',
    introduce:
      '트랙별 아기사자들이 멋쟁이 사자처럼 활동을 통해 다양하고 재미있는 프로젝트를 만들었습니다~~어쩌구트랙별아기사자들이 멋쟁이 사자처럼 활동을 통해 다양하고 재미있는 프로젝트를 만들었습니다~~어쩌구트랙별아기사자들이 멋쟁이 사자처럼 활동을 통해 다양하고 재미있는 프로젝트를 만들었습니다~~어쩌구',
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
    teamName: '개구리팀',
    projectType: '2022 아이디어톤',
    img: projectPic,
  },
  {
<<<<<<< HEAD
    name: '카모마일 알라쁑',
    introduce: '카모마일, 맥심 커피, 그 중 승자는? 승자를 가려라 서비스, 카모마일',
    teamName: '캠몸맘임',
    projectType: '2022 해커톤',
=======
    name: '프로젝트명',
    introduce: '',
    teamName: '',
    projectType: '',
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
    img: projectPic2,
  },
];

const ProjectSlider = () => {
<<<<<<< HEAD
  const [index, direction, increase, decrease, animationVariants] = useSlider<IProjectInner>(
    ProjectData,
    0.5,
    1000,
    true,
    'spring',
  );
  return (
    <Wrapper>
      <Left size={30} onClick={increase} />
      <RelativeWrapper>
        <Project ProjectData={ProjectData[index]} direction={direction} animationVaraints={animationVariants} />
      </RelativeWrapper>
      <Right size={30} onClick={decrease} />
=======
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
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
    </Wrapper>
  );
};

export default ProjectSlider;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
<<<<<<< HEAD
  overflow: hidden;
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
const RelativeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
<<<<<<< HEAD
  @media (max-width: 900px) {
    height: 150px;
  }
`;
const Right = styled(TfiAngleRight)`
  cursor: pointer;
  @media (max-width: 900px) {
    width: 15px;
    height: 15px;
  }
`;
const Left = styled(TfiAngleLeft)`
  cursor: pointer;
  @media (max-width: 900px) {
    width: 15px;
    height: 15px;
  }
=======
`;
const Right = styled(TfiAngleRight)`
  cursor: pointer;
`;
const Left = styled.div`
  cursor: pointer;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
