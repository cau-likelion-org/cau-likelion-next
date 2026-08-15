import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import Button from '@common/button/Button';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { IcChevronDown } from '@assets/svg';
import { getActivities, PageNavigation } from 'src/apis/activity';
import { Black, BackgroundWhite, BackgroundLight, Line, Fill, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 갤러리 페이지가 아직 세션/프로젝트/추억 탭을 URL로 지정하는 기능이 없어 셋 다 우선 /gallery로 이동
const PAGE_NAVIGATION_HREF: Record<PageNavigation, string> = {
  INTRO_CURRICULUM: '/about',
  PROJECT: '/project',
  GALLERY_SESSION: '/gallery',
  GALLERY_PROJECT: '/gallery',
  GALLERY_MEMORY: '/gallery',
};

const ActivitySection = () => {
  const router = useRouter();
  const { data: activities, isLoading, isError } = useQuery({ queryKey: ['activities'], queryFn: getActivities });

  return (
    <Wrapper>
      <Content>
        <Title>활동 소개</Title>
        {isLoading ? (
          <LoadingWrapper>
            <LinearLoading />
          </LoadingWrapper>
        ) : isError ? (
          <EmptyState variant="error" />
        ) : (
          <ListGroup>
            <List>
              {activities?.map(({ id, name, imageUrl, introduction, description, buttonName, pageNavigation }) => (
                <Card key={id}>
                  <TextGroup>
                    <CardTitle>{name}</CardTitle>
                    <CardSubtitle>{introduction}</CardSubtitle>
                    <CardDescription>{description}</CardDescription>
                  </TextGroup>
                  <Thumbnail $imageUrl={imageUrl} />
                  <HoverButtonWrapper>
                    <Button
                      size="large"
                      variant="solid"
                      color="primary"
                      trailingIcon={<ChevronRightIcon />}
                      onClick={() => router.push(PAGE_NAVIGATION_HREF[pageNavigation])}
                    >
                      {buttonName}
                    </Button>
                  </HoverButtonWrapper>
                </Card>
              ))}
            </List>
            <Footnote>*출처정보 (2026년 02월 기준)</Footnote>
          </ListGroup>
        )}
      </Content>
    </Wrapper>
  );
};

export default ActivitySection;

const Wrapper = styled.div`
  width: 1440px;
  padding: 80px 0;
  display: flex;
  justify-content: center;
  background-color: ${BackgroundLight.secondary};
  scroll-snap-align: start;
`;

const Content = styled.div`
  width: 1060px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
`;

const Title = styled.p`
  ${typographyCss(Typography.display2.bold)}
  color: ${Black.b900};
  margin: 0;
`;

const ListGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const Thumbnail = styled.div<{ $imageUrl?: string }>`
  flex-shrink: 0;
  width: 300px;
  height: 169px;
  border-radius: 12px;
  background-color: ${Fill.normal};
  background-image: ${(props) => (props.$imageUrl ? `url(${props.$imageUrl})` : 'none')};
  background-size: cover;
  background-position: center;
`;

const HoverButtonWrapper = styled.div`
  display: none;
  flex-shrink: 0;
  align-self: flex-end;
`;

const Card = styled.div`
  width: 100%;
  min-height: 233px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 32px;
  border-radius: 22px;
  background-color: ${BackgroundWhite.secondary};
  box-shadow: inset 0 0 0 1px ${Line.subtle};

  &:hover {
    justify-content: space-between;
    gap: 0;
    background-color: ${Orange.o50};
    box-shadow: inset 0 0 0 1px ${Orange.o500};

    ${Thumbnail} {
      display: none;
    }

    ${HoverButtonWrapper} {
      display: flex;
    }
  }
`;

const TextGroup = styled.div`
  width: 676px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
`;

const CardTitle = styled.p`
  ${typographyCss(Typography.title2.bold)}
  color: ${Black.b900};
  margin: 0;
`;

const CardSubtitle = styled.p`
  ${typographyCss(Typography.headline1.regular)}
  color: ${Black.b80};
  margin: 0;
`;

const CardDescription = styled.p`
  ${typographyCss(Typography.body1Normal.medium)}
  color: ${Black.b900};
  margin: 0;
`;

const ChevronRightIcon = styled(IcChevronDown)`
  width: 16px;
  height: 16px;
  transform: rotate(-90deg);
`;

const Footnote = styled.p`
  ${typographyCss(Typography.caption1.regular)}
  color: ${Black.b50};
  align-self: flex-start;
  margin: 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;
