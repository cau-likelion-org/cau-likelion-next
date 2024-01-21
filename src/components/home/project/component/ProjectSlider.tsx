import styled from 'styled-components';
import { StaticImageData } from 'next/image';

import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';
import allItChat from '@image/오리챗.png';
import wiki from '@image/위키.png';
import huru from '@image/탕후루.png';
import pass from '@image/휠패스.png';

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
    name: '오리챗(All-It-Chat)',
    introduce: '대학의 경계를 넘는 교환학생 멘토멘티 매칭 서비스',
    teamName: '오잉',
    projectType: '2023 해커톤',
    img: allItChat,
  },
  {
    name: 'CAU LIKELION WIKI',
    introduce: '중앙대 멋쟁이사자처럼 위키',
    teamName: '키위',
    projectType: '2023 사이드프로젝트',
    img: wiki,
  },
  {
    name: '학교 앞 탕후루',
    introduce: '떠나자, 본격 2000년대 테스트 모음집',
    teamName: '후루후루',
    projectType: '2023 중커톤',
    img: huru,
  },
  {
    name: '휠패스',
    introduce: '휠체어 이용자들의 안전과 편리를 위한, 문화 시설 경로 제공 서비스',
    teamName: 'BFGGyu',
    projectType: '2023 해커톤',
    img: pass,
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
    height: 250px;
  }
  @media (max-width: 600px) {
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
