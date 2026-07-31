import styled from 'styled-components';

import { Black, BackgroundWhite, BackgroundLight, Line, Fill } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface IActivity {
  title: string;
  subtitle: string;
  description: string;
}

const DESCRIPTION =
  '소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글';
const SUBTITLE = '일주일에 1번 정기적 대면 모임';

const ACTIVITIES: IActivity[] = [
  { title: '세션', subtitle: SUBTITLE, description: DESCRIPTION },
  { title: '프로젝트', subtitle: SUBTITLE, description: DESCRIPTION },
  { title: '선배와의 만남', subtitle: SUBTITLE, description: DESCRIPTION },
  { title: '스터디', subtitle: SUBTITLE, description: DESCRIPTION },
  { title: '소모임', subtitle: SUBTITLE, description: DESCRIPTION },
];

const ActivitySection = () => {
  return (
    <Wrapper>
      <Content>
        <Title>활동 소개</Title>
        <ListGroup>
          <List>
            {ACTIVITIES.map(({ title, subtitle, description }) => (
              <Card key={title}>
                <TextGroup>
                  <CardTitle>{title}</CardTitle>
                  <CardSubtitle>{subtitle}</CardSubtitle>
                  <CardDescription>{description}</CardDescription>
                </TextGroup>
                <Thumbnail />
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

const Card = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 32px;
  border-radius: 22px;
  background-color: ${BackgroundWhite.secondary};
  box-shadow: inset 0 0 0 1px ${Line.subtle};
`;

const TextGroup = styled.div`
  flex: 1 0 0;
  min-width: 0;
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

const Thumbnail = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 169px;
  border-radius: 12px;
  background-color: ${Fill.normal};
`;

const Footnote = styled.p`
  ${typographyCss(Typography.caption1.regular)}
  color: ${Black.b50};
  align-self: flex-start;
  margin: 0;
`;
