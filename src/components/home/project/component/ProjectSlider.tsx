import styled from 'styled-components';
import { StaticImageData } from 'next/image';

import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';
import projectPic2 from '@image/projectPic2.png';
import mayI from '@image/메이아이.png';
import chunghaha from '@image/logoThumbnail.png';

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
    name: 'MAY I',
    introduce: '기다리지 마세요, 메이아이하세요. 전문가-리포터 인터뷰 중개 서비스',
    teamName: '메이아이',
    projectType: '2022 해커톤',
    img: mayI,
  },
  {
    name: '카모마일',
    introduce: '카페, 모두의 마음대로 매일',
    teamName: '21, 23, 25',
    projectType: '2022 아이디어톤',
    img: projectPic2,
  },
  {
    name: 'CAU LIKELION',
    introduce: '우리도 사이트 있다 마, 함 봐바라',
    teamName: '중하하',
    projectType: '운영진 사이드 프로젝트',
    img: chunghaha,
  },
];

const ProjectSlider = () => {
  const [index, direction, decrease, increase, animationVariants] = useSlider<IProjectInner>(
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
