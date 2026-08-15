import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { getTalents } from 'src/apis/talent';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import TalentListBlock from './component/TalentListBlock';

// 인재상 관리에서 한 파트당 한 건으로 저장하고, 줄바꿈으로 구분한 문장을 목록으로 노출
const toItems = (content: string) =>
  content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

const TalentSection = () => {
  const { data, isLoading, isError } = useQuery({ queryKey: ['talents'], queryFn: getTalents });

  const talents = data ?? [];
  const common = talents.find((talent) => talent.partName.startsWith('공통'));
  const parts = talents.filter((talent) => talent !== common);

  return (
    <Wrapper>
      <Content>
        <SectionTitle>중앙대학교 멋쟁이사자처럼 인재상</SectionTitle>
        {isLoading ? (
          <LoadingWrapper>
            <LinearLoading />
          </LoadingWrapper>
        ) : isError ? (
          <EmptyState variant="error" />
        ) : (
          <Card>
            {common && <TalentListBlock title={common.partName} items={toItems(common.content)} />}
            <PartRow>
              {parts.map((part) => (
                <PartCard key={part.id}>
                  <TalentListBlock title={part.partName} items={toItems(part.content)} />
                </PartCard>
              ))}
            </PartRow>
          </Card>
        )}
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

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
`;
