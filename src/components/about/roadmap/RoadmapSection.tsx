import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { getRoadmap } from 'src/apis/roadmap';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { BackgroundWhite, Black, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const RoadmapSection = () => {
  const { data: roadmap, isLoading, isError } = useQuery({ queryKey: ['roadmap'], queryFn: getRoadmap });

  if (!isLoading && !isError && !roadmap) return null;

  return (
    <Wrapper>
      <Content>
        <SectionTitle>활동 로드맵</SectionTitle>
        {isLoading ? (
          <LoadingWrapper>
            <LinearLoading />
          </LoadingWrapper>
        ) : isError ? (
          <EmptyState variant="error" />
        ) : (
          <>
            <ChartImageWrapper>
              <ChartImage src={roadmap!.imageUrl} alt="활동 로드맵" />
            </ChartImageWrapper>
            <Caption>*일정 상 변경될 수 있습니다</Caption>
          </>
        )}
      </Content>
    </Wrapper>
  );
};

export default RoadmapSection;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 80px 20px;
  background-color: ${BackgroundWhite.tertiary};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
  width: 100%;
  max-width: 1060px;
`;

const SectionTitle = styled.p`
  margin: 0;
  width: 100%;
  text-align: center;
  color: ${Black.b900};
  ${typographyCss(Typography.display2.bold)}
`;

const ChartImageWrapper = styled.div`
  width: 100%;
`;

const ChartImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

const Caption = styled.p`
  margin: 0;
  width: 100%;
  color: ${Label.alternative};
  ${typographyCss(Typography.caption1.regular)}
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
`;
