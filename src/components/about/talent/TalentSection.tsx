import styled from 'styled-components';

import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import TalentListBlock from './component/TalentListBlock';

const COMMON_TALENT = ['열정 있는 사람', '열정 있는 사람', '열정 있는 사람'];

const PART_TALENTS = [
  { title: '기획디자인', items: ['열정 있는 사람', '열정 있는 사람', '열정 있는 사람'] },
  { title: '프론트엔드', items: ['열정 있는 사람', '열정 있는 사람', '열정 있는 사람'] },
  { title: '백엔드', items: ['열정 있는 사람', '열정 있는 사람', '열정 있는 사람'] },
];

const TalentSection = () => {
  return (
    <Wrapper>
      <Content>
        <SectionTitle>중앙대학교 멋쟁이사자처럼 인재상</SectionTitle>
        <Card>
          <TalentListBlock title="공통 인재상" items={COMMON_TALENT} />
          <PartRow>
            {PART_TALENTS.map((part) => (
              <PartCard key={part.title}>
                <TalentListBlock title={part.title} items={part.items} />
              </PartCard>
            ))}
          </PartRow>
        </Card>
      </Content>
    </Wrapper>
  );
};

export default TalentSection;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 60px 190px 80px;
  background-color: ${Black.b700};

  @media (max-width: 1200px) {
    padding: 60px 60px 80px;
  }

  @media (max-width: 700px) {
    padding: 48px 20px 60px;
  }
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
  color: #ffffff;
  ${typographyCss(Typography.display2.bold)}
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  width: 100%;
  padding: 28px;
  border-radius: 14px;
  background-color: ${Black.b800};
`;

const PartRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const PartCard = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  padding: 12px;
  border-radius: 12px;
  background-color: ${Black.b900};
`;
