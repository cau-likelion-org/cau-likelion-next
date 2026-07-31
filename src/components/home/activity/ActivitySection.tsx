import styled from 'styled-components';
import { useRouter } from 'next/router';

import Button from '@common/button/Button';
import { IcChevronDown } from '@assets/svg';
import { Black, BackgroundWhite, BackgroundLight, Line, Fill, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface IActivity {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  href: string;
}

const DESCRIPTION =
  '소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글';
const SUBTITLE = '일주일에 1번 정기적 대면 모임';

const ACTIVITIES: IActivity[] = [
  { title: '세션', subtitle: SUBTITLE, description: DESCRIPTION, buttonText: '파트별 커리큘럼 보기', href: '#' },
  { title: '프로젝트', subtitle: SUBTITLE, description: DESCRIPTION, buttonText: '프로젝트 더보기', href: '/project' },
  { title: '선배와의 만남', subtitle: SUBTITLE, description: DESCRIPTION, buttonText: '더보기', href: '/gallery' },
  { title: '스터디', subtitle: SUBTITLE, description: DESCRIPTION, buttonText: '더보기', href: '/gallery' },
  { title: '소모임', subtitle: SUBTITLE, description: DESCRIPTION, buttonText: '더보기', href: '/gallery' },
];

const ActivitySection = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <Content>
        <Title>활동 소개</Title>
        <ListGroup>
          <List>
            {ACTIVITIES.map(({ title, subtitle, description, buttonText, href }) => (
              <Card key={title}>
                <TextGroup>
                  <CardTitle>{title}</CardTitle>
                  <CardSubtitle>{subtitle}</CardSubtitle>
                  <CardDescription>{description}</CardDescription>
                </TextGroup>
                <Thumbnail />
                <HoverButtonWrapper>
                  <Button
                    size="large"
                    variant="solid"
                    color="primary"
                    trailingIcon={<ChevronRightIcon />}
                    onClick={() => router.push(href)}
                  >
                    {buttonText}
                  </Button>
                </HoverButtonWrapper>
              </Card>
            ))}
          </List>
          <Footnote>*출처정보 (2026년 02월 기준)</Footnote>
        </ListGroup>
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

const Thumbnail = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 169px;
  border-radius: 12px;
  background-color: ${Fill.normal};
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
