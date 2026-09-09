import styled from 'styled-components';

import { Generation } from '@@types/request';
import Radio from '@common/radio/Radio';
import ContentBadge from '@common/badge/ContentBadge';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import Button from '@common/button/Button';
import { excludeCommonPart } from '@utils/index';
import { Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface PartManageSectionProps {
  generations: Generation[];
  isLoading?: boolean;
  isError?: boolean;
  onSelectCurrent: (generationId: number) => void;
  isUpdatingCurrent?: boolean;
  onCreate: () => void;
}

const PartManageSection = ({
  generations,
  isLoading = false,
  isError = false,
  onSelectCurrent,
  isUpdatingCurrent = false,
  onCreate,
}: PartManageSectionProps) => {
  const sortedGenerations = [...generations].sort((a, b) => b.number - a.number);

  return (
    <Wrapper>
      <Header>
        <Title>파트 관리</Title>
        <Button color="assistive" size="small" onClick={onCreate}>
          기수/파트 생성
        </Button>
      </Header>

      <HeaderRow>
        <HeadCell>활동 여부</HeadCell>
        <HeadCell>기수</HeadCell>
        <HeadCell>활동 년도</HeadCell>
        <HeadCell>파트</HeadCell>
      </HeaderRow>

      {isLoading ? (
        <StateWrapper>
          <CircularLoading size={32} />
        </StateWrapper>
      ) : isError ? (
        <TableEmptyState variant="error" />
      ) : sortedGenerations.length === 0 ? (
        <TableEmptyState message="생성된 기수가 없습니다." />
      ) : (
        <Body>
          {sortedGenerations.map((generation, index) => (
            <Row key={generation.id} $divider={index !== sortedGenerations.length - 1}>
              <RadioCell>
                <Radio
                  size="medium"
                  ariaLabel={`${generation.number}기를 현재 활동 기수로 전환`}
                  checked={generation.status !== 'BEFORE_ACTIVITY'}
                  disabled={generation.status === 'AFTER_ACTIVITY' || isUpdatingCurrent}
                  onChange={(checked) => checked && onSelectCurrent(generation.id)}
                />
              </RadioCell>
              <NumberCell>{generation.number}</NumberCell>
              <Cell>{generation.year}</Cell>
              <BadgeCell>
                {excludeCommonPart(generation.parts).map((part) => (
                  <ContentBadge key={part.id} text={part.name} color="accent" variant="solid" size="medium" />
                ))}
              </BadgeCell>
            </Row>
          ))}
        </Body>
      )}
    </Wrapper>
  );
};

export default PartManageSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  padding: 0 14px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const GRID = '100px 90px 118px 1fr';

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: ${GRID};
  gap: 20px;
  align-items: center;
  width: 100%;
`;

const HeadCell = styled.span`
  color: ${Label.assistive};
  ${typographyCss(Typography.headline1.medium)}
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div<{ $divider: boolean }>`
  display: grid;
  grid-template-columns: ${GRID};
  gap: 20px;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;

  ${(props) => props.$divider && `border-bottom: 1px solid ${Line.normal};`}
`;

const RadioCell = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const NumberCell = styled.div`
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}
`;

const Cell = styled.div`
  color: ${Label.strong};
  ${typographyCss(Typography.headline2.medium)}
`;

const BadgeCell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const StateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 240px;
`;

const TableEmptyState = styled(EmptyState)`
  min-height: 240px;
`;
