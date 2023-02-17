import styled from 'styled-components';
import { StaticImageData } from 'next/image';

import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';
import projectPic from '@image/projectPic.png';
import projectPic2 from '@image/projectPic2.png';

import Project from './Project';
import useSlider from 'src/hooks/useSlider';

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
    introduce: '아기 개구리를 살려라! 아기 개구리 살리는 서비스, 개굴개굴 baby frog',
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
`;
