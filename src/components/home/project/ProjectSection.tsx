import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import Button from '@common/button/Button';
import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import ProjectCard, { IProject } from './component/ProjectCard';

const PROJECTS: IProject[] = [
  { name: '서비스명', generation: '13기', category: '아이디어톤' },
  { name: '서비스명', generation: '13기', category: '아이디어톤' },
  { name: '서비스명', generation: '13기', category: '아이디어톤', award: '일이상사오일이상사오일이상사오' },
  { name: '서비스명', generation: '13기', category: '아이디어톤' },
  { name: '서비스명', generation: '13기', category: '아이디어톤' },
];

// Swiper's loop mode needs roughly 2x slidesPerView worth of real slides to cycle smoothly,
// so the 5 real projects are repeated to give it enough material.
const REPEAT_COUNT = 3;
const SLIDES = Array.from({ length: REPEAT_COUNT }, () => PROJECTS).flat();
const FEATURED_INDEX = PROJECTS.findIndex((project) => project.award);
const INITIAL_SLIDE = FEATURED_INDEX === -1 ? 0 : PROJECTS.length + FEATURED_INDEX;

const ProjectSection = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <Title>프로젝트</Title>
      <CardSwiper
        modules={[Autoplay]}
        slidesPerView="auto"
        centeredSlides
        loop
        observer
        observeParents
        spaceBetween={32}
        initialSlide={INITIAL_SLIDE}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {SLIDES.map((project, index) => (
          <SwiperSlide key={index}>
            <ProjectCard {...project} onClick={() => router.push('/project')} />
          </SwiperSlide>
        ))}
      </CardSwiper>
      <Button size="large" variant="solid" color="assistive" onClick={() => router.push('/project')}>
        프로젝트 더보기
      </Button>
    </Wrapper>
  );
};

export default ProjectSection;

const Wrapper = styled.div`
  width: 1060px;
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
  scroll-snap-align: start;
`;

const Title = styled.p`
  ${typographyCss(Typography.display2.bold)}
  color: ${Black.b900};
  margin: 0;
`;

const CardSwiper = styled(Swiper)`
  width: calc(100% + 380px);
  margin-left: -190px;
  margin-right: -190px;
  padding: 32px 0 50px;

  .swiper-slide {
    width: 340px;
  }
`;
