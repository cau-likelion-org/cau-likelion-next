import { useState } from 'react';
import styled from 'styled-components';

import { RecruitmentTextResponse, RecruitmentTextStatus } from 'src/apis/recruitment';
import ContentBadge from '@common/badge/ContentBadge';
import LoadingArea from '@common/loading/LoadingArea';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import PaginationNavigation from '@common/pagination/PaginationNavigation';
import { Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { formatDate, formatDateTime } from '@utils/index';

const PAGE_SIZE = 6;

export const STATUS_BADGE: Record<
  RecruitmentTextStatus,
  { label: string; color: 'neutral' | 'accent'; variant: 'solid' | 'outlined' }
> = {
  SCHEDULED: { label: '발송 예약', color: 'accent', variant: 'outlined' },
  SENT: { label: '발송 완료', color: 'accent', variant: 'solid' },
  CANCELLED: { label: '발송 취소', color: 'neutral', variant: 'solid' },
};

interface RecruitmentTextSectionProps {
  texts: RecruitmentTextResponse[];
  isLoading?: boolean;
  isError?: boolean;
  onSelect: (text: RecruitmentTextResponse) => void;
}

const RecruitmentTextSection = ({
  texts,
  isLoading = false,
  isError = false,
  onSelect,
}: RecruitmentTextSectionProps) => {
  const [page, setPage] = useState(1);
  const totalPage = Math.max(1, Math.ceil(texts.length / PAGE_SIZE));
  const pageItems = texts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Wrapper>
      <Title>사전 알림 이메일 발송 현황</Title>

      <Table>
        <HeaderRow>
          <HeadCell>제목</HeadCell>
          <HeadCell>수신자 수</HeadCell>
          <HeadCell>메일 작성일</HeadCell>
          <HeadCell>발송일</HeadCell>
          <HeadCell>상태</HeadCell>
        </HeaderRow>

        {isLoading ? (
          <LoadingArea minHeight={240}>
            <CircularLoading size={32} />
          </LoadingArea>
        ) : isError ? (
          <TableEmptyState variant="error" />
        ) : texts.length === 0 ? (
          <TableEmptyState message="발송한 사전 알림 메일이 없습니다." />
        ) : (
          <>
            <Body>
              {pageItems.map((text, index) => {
                const badge = STATUS_BADGE[text.status];
                return (
                  <Row key={text.id} $divider={index !== pageItems.length - 1}>
                    <TitleCell type="button" onClick={() => onSelect(text)}>
                      {text.title}
                    </TitleCell>
                    <Cell>{text.targetCount}명</Cell>
                    <Cell>{formatDate(text.createdAt)}</Cell>
                    <Cell>{text.scheduledSendAt ? formatDateTime(text.scheduledSendAt) : '-'}</Cell>
                    <BadgeCell>
                      <ContentBadge text={badge.label} color={badge.color} variant={badge.variant} size="medium" />
                    </BadgeCell>
                  </Row>
                );
              })}
            </Body>
            <PaginationNavigation variant="compact" currentPage={page} totalPage={totalPage} onPageChange={setPage} />
          </>
        )}
      </Table>
    </Wrapper>
  );
};

export default RecruitmentTextSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
  padding: 0 14px;
`;

const Title = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

const GRID = '258px 84px 140px 200px 90px';

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
  padding: 0 0 22px;

  ${(props) => props.$divider && `border-bottom: 1px solid ${Line.normal};`}
`;

const TitleCell = styled.button`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
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

const BadgeCell = styled.div`
  display: flex;
`;

const TableEmptyState = styled(EmptyState)`
  min-height: 240px;
`;
