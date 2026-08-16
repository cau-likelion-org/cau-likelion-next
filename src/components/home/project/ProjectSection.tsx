import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import Button from '@common/button/Button';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { getProjectList } from 'src/apis/project';
import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { MOBILE } from '@home/common/responsive';

import ProjectCard from './component/ProjectCard';

// Swiper's loop mode needs roughly 2x slidesPerView worth of real slides to cycle smoothly,
// so the fetched projects are repeated to give it enough material.
const REPEAT_COUNT = 3;

const ProjectSection = () => {
  const router = useRouter();
  const { data: projects, isLoading, isError } = useQuery({ queryKey: ['landingProjects'], queryFn: getProjectList });
  const exposedProjects = projects?.filter((project) => project.isExposed) ?? [];

  if (!isLoading && !isError && exposedProjects.length === 0) return null;

  const slides = Array.from({ length: REPEAT_COUNT }, () => exposedProjects).flat();
  const featuredIndex = exposedProjects.findIndex((project) => project.banner);
  const initialSlide = featuredIndex === -1 ? 0 : exposedProjects.length + featuredIndex;

  return (
    <Wrapper>
      <Title>프로젝트</Title>
      {isLoading ? (
        <LoadingWrapper>
          <LinearLoading />
        </LoadingWrapper>
      ) : isError ? (
        <EmptyState variant="error" />
      ) : (
        <>
          <CardSwiper
            modules={[Autoplay]}
            slidesPerView="auto"
            centeredSlides
            loop
            observer
            observeParents
            spaceBetween={32}
            initialSlide={initialSlide}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
          >
            {slides.map((project, index) => (
              <SwiperSlide key={index}>
                <ProjectCard {...project} href="/project" />
              </SwiperSlide>
            ))}
          </CardSwiper>
          <Button size="large" variant="solid" color="assistive" onClick={() => router.push('/project')}>
            프로젝트 더보기
          </Button>
        </>
      )}
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

  @media (max-width: ${MOBILE}px) {
    width: 100%;
    padding: 60px 20px;
  }
`;

const Title = styled.p`
  ${typographyCss(Typography.display2.bold)}
  color: ${Black.b900};
  margin: 0;

  @media (max-width: ${MOBILE}px) {
    ${typographyCss(Typography.title1.bold)}
  }
`;

const CardSwiper = styled(Swiper)`
  width: calc(100% + 380px);
  margin-left: -190px;
  margin-right: -190px;
  padding: 32px 0 50px;

  .swiper-slide {
    width: 340px;
  }

  @media (max-width: ${MOBILE}px) {
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;

    .swiper-slide {
      width: 335px;
    }
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;
