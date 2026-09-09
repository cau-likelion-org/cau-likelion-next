import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import Button from '@common/button/Button';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { IcChevronDown } from '@assets/svg';
import { getActivities, PageNavigation } from 'src/apis/activity';
import { Black, BackgroundWhite, BackgroundLight, Line, Fill, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { MOBILE } from '@home/common/responsive';

// 700~900px 구간은 이미지를 고정폭 300px로 유지한 채 가로 배치를 유지하고, 텍스트만 줄바꿈시킨다.
// 그보다 좁아지면(Figma 모바일 시안 기준) 이미지가 카드 전체 폭을 차지하는 세로 배치로 전환한다.
const CARD_MOBILE = 700;

const PAGE_NAVIGATION_HREF: Record<PageNavigation, string> = {
  INTRO_CURRICULUM: '/about#curriculum',
  PROJECT: '/project',
  GALLERY_SESSION: '/gallery?tab=session',
  GALLERY_PROJECT: '/gallery?tab=project',
  GALLERY_MEMORY: '/gallery?tab=gallery',
};

const ActivitySection = () => {
  const router = useRouter();
  const {
    data: activities,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['activities'], queryFn: () => getActivities() });

  const [expandedId, setExpandedId] = useState<number | null>(null);

  // 해시가 있는 링크는 이동 후 직접 해당 섹션으로 스크롤하므로, Next의 기본 top 스크롤은 꺼둔다
  const handleNavigate = (pageNavigation: PageNavigation) => {
    const href = PAGE_NAVIGATION_HREF[pageNavigation];
    router.push(href, undefined, { scroll: !href.includes('#') });
  };

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
                <Card
                  key={id}
                  $expanded={expandedId === id}
                  onClick={() => setExpandedId((prev) => (prev === id ? null : id))}
                >
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
                      onClick={() => handleNavigate(pageNavigation)}
                    >
                      {buttonName}
                    </Button>
                  </HoverButtonWrapper>
                  <MobileButtonWrapper onClick={(event) => event.stopPropagation()}>
                    <Button
                      size="medium"
                      variant="solid"
                      color="primary"
                      trailingIcon={<ChevronRightIcon />}
                      onClick={() => handleNavigate(pageNavigation)}
                    >
                      {buttonName}
                    </Button>
                  </MobileButtonWrapper>
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
  width: 100%;
  padding: 80px 0;
  display: flex;
  justify-content: center;
  background-color: ${BackgroundLight.secondary};
  scroll-snap-align: start;

  @media (max-width: ${MOBILE}px) {
    width: 100%;
    padding: 60px 20px;
  }
`;

const Content = styled.div`
  width: 1060px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;

  @media (max-width: ${MOBILE}px) {
    width: 100%;
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

  @media (max-width: ${CARD_MOBILE}px) {
    width: 100%;
    max-width: 300px;
    height: auto;
    aspect-ratio: 300 / 169;
  }
`;

const HoverButtonWrapper = styled.div`
  display: none;
  flex-shrink: 0;
  align-self: flex-end;
`;

const MobileButtonWrapper = styled.div`
  display: none;
  flex-shrink: 0;
  align-self: flex-start;
`;

const CardDescription = styled.p`
  ${typographyCss(Typography.body1Normal.medium)}
  color: ${Black.b900};
  margin: 0;

  @media (max-width: ${CARD_MOBILE}px) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
`;

const Card = styled.div<{ $expanded: boolean }>`
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

  @media (max-width: ${CARD_MOBILE}px) {
    flex-direction: column;
    min-height: 0;
    cursor: pointer;

    /* 모바일 브라우저에서 탭 후 남는 hover 상태를 무시하고, $expanded만 열림 상태로 쓴다 */
    &,
    &:hover {
      justify-content: flex-start;
      gap: 14px;
      background-color: ${BackgroundWhite.secondary};
      box-shadow: inset 0 0 0 1px ${Line.subtle};

      ${Thumbnail} {
        display: block;
      }

      ${HoverButtonWrapper} {
        display: none;
      }
    }

    ${(props) =>
      props.$expanded &&
      css`
        &,
        &:hover {
          background-color: ${Orange.o50};
          box-shadow: inset 0 0 0 1px ${Orange.o500};

          ${Thumbnail} {
            display: none;
          }

          ${MobileButtonWrapper} {
            display: flex;
          }

          ${CardDescription} {
            display: block;
            overflow: visible;
          }
        }
      `}
  }
`;

const TextGroup = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  max-width: 676px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;

  @media (max-width: ${CARD_MOBILE}px) {
    width: 100%;
    max-width: none;
  }
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
