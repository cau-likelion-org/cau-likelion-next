import { useState } from 'react';
import styled from 'styled-components';

import { RecruitmentSubscriberResponse } from 'src/apis/recruitment';
import Button from '@common/button/Button';
import Checkbox from '@common/checkbox/Checkbox';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import PaginationNavigation from '@common/pagination/PaginationNavigation';
import PartSelect from '@mypage/component/PartSelect';
import { Black, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export const ALL_PART_FILTER = '전체';
const PAGE_SIZE = 6;

const formatDate = (value: string) => value.slice(0, 10).replace(/-/g, '/');

interface RecruitmentSubscriberSectionProps {
  subscribers: RecruitmentSubscriberResponse[];
  isLoading?: boolean;
  isError?: boolean;
  interestPartOptions: string[];
  interestPartFilter: string;
  onInterestPartFilterChange: (value: string) => void;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onSelectAll: () => void;
}

const RecruitmentSubscriberSection = ({
  subscribers,
  isLoading = false,
  isError = false,
  interestPartOptions,
  interestPartFilter,
  onInterestPartFilterChange,
  selectedIds,
  onToggleSelect,
  onSelectAll,
}: RecruitmentSubscriberSectionProps) => {
  const [page, setPage] = useState(1);
  const totalPage = Math.max(1, Math.ceil(subscribers.length / PAGE_SIZE));
  const pageItems = subscribers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedInScopeCount = subscribers.filter((subscriber) => selectedIds.has(subscriber.id)).length;

  return (
    <Wrapper>
      <TitleRow>
        <Title>사전 알림 신청자 명단</Title>
        <PartSelect
          value={interestPartFilter}
          options={[ALL_PART_FILTER, ...interestPartOptions]}
          onChange={(value) => {
            onInterestPartFilterChange(value);
            setPage(1);
          }}
          ariaLabel="관심 파트 필터"
        />
      </TitleRow>

      <SelectAllRow>
        <Button variant="outlined" color="primary" size="small" onClick={onSelectAll}>
          전체선택
        </Button>
        <SelectionSummary>
          <SelectedCount $active={selectedInScopeCount > 0}>선택 {selectedInScopeCount}명</SelectedCount>
          <TotalCount>총 {subscribers.length}명</TotalCount>
        </SelectionSummary>
      </SelectAllRow>

      <Table>
        <HeaderRow>
          <HeadCell>개별 발송</HeadCell>
          <HeadCell>이름</HeadCell>
          <HeadCell>관심 파트</HeadCell>
          <HeadCell>알림 신청 이메일</HeadCell>
          <HeadCell>알림 신청일</HeadCell>
        </HeaderRow>

        {isLoading ? (
          <StateWrapper>
            <CircularLoading size={32} />
          </StateWrapper>
        ) : isError ? (
          <TableEmptyState variant="error" />
        ) : subscribers.length === 0 ? (
          <TableEmptyState message="사전 알림 신청자가 없습니다." />
        ) : (
          <>
            <Body>
              {pageItems.map((subscriber, index) => (
                <Row key={subscriber.id} $divider={index !== pageItems.length - 1}>
                  <CheckboxCell>
                    <Checkbox
                      checked={selectedIds.has(subscriber.id)}
                      ariaLabel={`${subscriber.name} 개별 발송 선택`}
                      onChange={() => onToggleSelect(subscriber.id)}
                    />
                  </CheckboxCell>
                  <NameCell>{subscriber.name}</NameCell>
                  <Cell>{subscriber.interestParts.map((part) => part.name).join(', ') || '-'}</Cell>
                  <Cell>{subscriber.email}</Cell>
                  <Cell>{formatDate(subscriber.registeredAt)}</Cell>
                </Row>
              ))}
            </Body>
            <PaginationNavigation variant="compact" currentPage={page} totalPage={totalPage} onPageChange={setPage} />
          </>
        )}
      </Table>
    </Wrapper>
  );
};

export default RecruitmentSubscriberSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
  padding: 0 14px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const SelectAllRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const SelectionSummary = styled.div`
  display: flex;
  align-items: center;
`;

const SelectedCount = styled.span<{ $active: boolean }>`
  padding: 0 4px;
  opacity: 0.74;
  color: ${(props) => (props.$active ? Orange.o500 : Label.alternative)};
  ${typographyCss(Typography.body2Normal.medium)}
`;

const TotalCount = styled.span`
  padding: 0 4px;
  opacity: 0.74;
  color: ${Label.alternative};
  ${typographyCss(Typography.body2Normal.medium)}
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

const GRID = '68px 90px 118px 356px 140px';

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
  gap: 22px;
`;

const Row = styled.div<{ $divider: boolean }>`
  display: grid;
  grid-template-columns: ${GRID};
  gap: 20px;
  align-items: center;
  width: 100%;
  padding-bottom: 22px;

  ${(props) => props.$divider && `border-bottom: 1px solid ${Line.normal};`}
`;

const CheckboxCell = styled.div`
  display: flex;
`;

const NameCell = styled.div`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}
`;

const Cell = styled.div`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${Label.strong};
  ${typographyCss(Typography.headline2.medium)}
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
