import { useMemo } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';

import { getTalents } from 'src/apis/talent';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import TalentListBlock from './component/TalentListBlock';

const COMMON_PART_NAME = '공통';

const TalentSection = () => {
  const { data: talents, isLoading, isError } = useQuery({ queryKey: ['talents'], queryFn: getTalents });

  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    (talents ?? []).forEach(({ partName, content }) => {
      const items = map.get(partName) ?? [];
      items.push(content);
      map.set(partName, items);
    });
    return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
  }, [talents]);

  const commonGroup = groups.find((group) => group.title === COMMON_PART_NAME);
  const partGroups = groups.filter((group) => group.title !== COMMON_PART_NAME);

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
            {commonGroup && <TalentListBlock title="공통 인재상" items={commonGroup.items} />}
            <PartRow>
              {partGroups.map((part) => (
                <PartCard key={part.title}>
                  <TalentListBlock title={part.title} items={part.items} />
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
