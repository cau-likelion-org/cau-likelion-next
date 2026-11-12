import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import Button from '@common/button/Button';
import EmptyState from '@common/emptyState/EmptyState';
import PaginationNavigation from '@common/pagination/PaginationNavigation';
import HorizontalScrollArea from '@common/scrollArea/HorizontalScrollArea';
import TextField from '@common/textField/TextField';
import TextSelect from '@common/select/TextSelect';
import ProjectFilterSelect from '@project/projects/ProjectFilterSelect';
import { PART_OPTIONS_MOCK } from '@recruit/apply/mock';
import { IcDownload, IcSearch } from '@assets/svg';
import { downloadCsv } from '@utils/csv';
import { Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { buildApplicantCsvRows } from './applicantCsv';
import {
  APPLICANT_GENERATIONS,
  ApplicantDetail,
  SCREENING_RESULT_LABEL,
  SUBMISSION_STATUS_LABEL,
  ScreeningResult,
  getApplicants,
} from './applicantMock';
import { RECRUIT_INTERVIEW_SETTING_MOCK } from './mock';
import StatCounts from './StatCounts';

const PAGE_SIZE = 10;
const ALL = '전체';

const SUBMISSION_STATUS_OPTIONS = [ALL, ...Object.values(SUBMISSION_STATUS_LABEL)];
const PART_FILTER_OPTIONS = [ALL, ...PART_OPTIONS_MOCK];
const RESULT_OPTIONS = [ALL, ...Object.values(SCREENING_RESULT_LABEL)];

const COLUMNS = [
  { title: '이름', width: 90 },
  { title: '학번', width: 120 },
  { title: '학과', width: 120 },
  { title: '파트', width: 120 },
  { title: '이메일', width: 160 },
  { title: '전화번호', width: 150 },
  { title: '제출 상태', width: 80 },
  { title: '서류', width: 80 },
  { title: '면접', width: 80 },
];

const toGenerationLabel = (generation: number) => `${generation}기 모집`;

// 결과 필터는 가장 최근 전형 결과(면접 결과가 있으면 면접, 없으면 서류) 기준으로 거른다
const getLatestResult = (applicant: ApplicantDetail): ScreeningResult | undefined =>
  applicant.interviewResult ?? applicant.documentResult;

const ApplicantListSection = () => {
  const [generation, setGeneration] = useState(APPLICANT_GENERATIONS[0]);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [partFilter, setPartFilter] = useState(ALL);
  const [resultFilter, setResultFilter] = useState(ALL);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const applicantsQuery = useQuery({
    queryKey: ['recruitApplicants', generation],
    queryFn: () => getApplicants(generation),
  });
  const applicants = applicantsQuery.data ?? [];

  const trimmedKeyword = keyword.trim();
  const filtered = applicants.filter((applicant) => {
    if (statusFilter !== ALL && SUBMISSION_STATUS_LABEL[applicant.submissionStatus] !== statusFilter) return false;
    if (partFilter !== ALL && applicant.part !== partFilter) return false;
    const latestResult = getLatestResult(applicant);
    if (resultFilter !== ALL && (!latestResult || SCREENING_RESULT_LABEL[latestResult] !== resultFilter)) return false;
    if (trimmedKeyword && !applicant.name.includes(trimmedKeyword) && !applicant.studentId?.includes(trimmedKeyword))
      return false;
    return true;
  });

  const totalPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPage);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const changeFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const downloadFiltered = () =>
    downloadCsv(
      `${generation}기_지원서.csv`,
      buildApplicantCsvRows(filtered, RECRUIT_INTERVIEW_SETTING_MOCK.unitMinutes),
    );

  return (
    <Root>
      <TitleRow>
        <Title>지원자 목록</Title>
        <Button
          size="small"
          color="assistive"
          trailingIcon={<IcDownload width={16} height={16} />}
          disabled={filtered.length === 0}
          onClick={downloadFiltered}
        >
          CSV 다운로드
        </Button>
      </TitleRow>
      <Body>
        <SummaryRow>
          <SummaryTitle>
            <SummaryHeading>전체 지원자</SummaryHeading>
            <TextSelect
              ariaLabel="모집 기수"
              options={APPLICANT_GENERATIONS.map(toGenerationLabel)}
              value={toGenerationLabel(generation)}
              onChange={(label) => {
                setGeneration(Number.parseInt(label, 10));
                setPage(1);
              }}
            />
          </SummaryTitle>
          <StatCounts
            items={[
              ...PART_OPTIONS_MOCK.map((part) => ({
                label: part,
                count: applicants.filter((applicant) => applicant.part === part).length,
              })),
              { label: '총', count: applicants.length, tone: 'strong' as const },
            ]}
          />
        </SummaryRow>
        <Content>
          <Filters>
            <FilterSelect
              heading="제출 상태"
              options={SUBMISSION_STATUS_OPTIONS}
              value={statusFilter}
              onChange={changeFilter(setStatusFilter)}
            />
            <FilterSelect
              heading="파트 구분"
              options={PART_FILTER_OPTIONS}
              value={partFilter}
              onChange={changeFilter(setPartFilter)}
            />
            <FilterSelect
              heading="결과"
              options={RESULT_OPTIONS}
              value={resultFilter}
              onChange={changeFilter(setResultFilter)}
            />
            <SearchField
              heading="이름/학번 검색"
              placeholder="텍스트를 입력해 주세요."
              leadingIcon={<IcSearch width={22} height={22} />}
              value={keyword}
              onChange={(event) => changeFilter(setKeyword)(event.target.value)}
            />
          </Filters>
          {applicantsQuery.isPending ? null : applicants.length === 0 ? (
            <Empty message="아직 지원자가 없습니다" />
          ) : filtered.length === 0 ? (
            <Empty message="검색 결과가 없습니다" />
          ) : (
            <TableArea>
              <HorizontalScrollArea>
                <Table role="table" aria-label="지원자 목록">
                  <HeaderRow role="row">
                    {COLUMNS.map(({ title, width }) => (
                      <HeaderCell key={title} role="columnheader" $width={width}>
                        {title}
                      </HeaderCell>
                    ))}
                  </HeaderRow>
                  <Rows>
                    {pageItems.map((applicant) => (
                      <BodyRow key={applicant.id} role="row">
                        <NameCell role="cell" $width={COLUMNS[0].width}>
                          <RowLink href={`/mypage/recruit/applicants/${applicant.id}`}>{applicant.name}</RowLink>
                        </NameCell>
                        <Cell value={applicant.studentId} width={COLUMNS[1].width} />
                        <Cell value={applicant.major} width={COLUMNS[2].width} />
                        <Cell value={applicant.part} width={COLUMNS[3].width} />
                        <Cell value={applicant.email} width={COLUMNS[4].width} />
                        <Cell value={applicant.phone} width={COLUMNS[5].width} />
                        <Cell value={SUBMISSION_STATUS_LABEL[applicant.submissionStatus]} width={COLUMNS[6].width} />
                        <Cell
                          value={applicant.documentResult && SCREENING_RESULT_LABEL[applicant.documentResult]}
                          width={COLUMNS[7].width}
                        />
                        <Cell
                          value={applicant.interviewResult && SCREENING_RESULT_LABEL[applicant.interviewResult]}
                          width={COLUMNS[8].width}
                        />
                      </BodyRow>
                    ))}
                  </Rows>
                </Table>
              </HorizontalScrollArea>
              <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={setPage} />
            </TableArea>
          )}
        </Content>
      </Body>
    </Root>
  );
};

export default ApplicantListSection;

const Cell = ({ value, width }: { value?: string; width: number }) => (
  <BodyCell role="cell" $width={width} $empty={!value}>
    {value || '-'}
  </BodyCell>
);

const Root = styled.section`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 0 14px;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const SummaryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const SummaryHeading = styled.h3`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 0 14px;
`;

const Filters = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 18px;
`;

const FilterSelect = styled(ProjectFilterSelect)`
  flex-shrink: 0;
  width: 160px;
`;

const SearchField = styled(TextField)`
  flex: 1 0 0;
  min-width: 0;
`;

const Empty = styled(EmptyState)`
  padding: 80px 0;
`;

const TableArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const HeaderRow = styled.div`
  display: flex;
  gap: 20px;
`;

const HeaderCell = styled.span<{ $width: number }>`
  flex-shrink: 0;
  width: ${(props) => props.$width}px;
  color: ${Label.assistive};
  ${typographyCss(Typography.headline1.medium)}
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyRow = styled.div`
  position: relative;
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-radius: 6px;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  & + & {
    box-shadow: inset 0 1px 0 ${Line.normal};
  }
`;

const BodyCell = styled.span<{ $width: number; $empty?: boolean }>`
  flex-shrink: 0;
  width: ${(props) => props.$width}px;
  padding: 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => (props.$empty ? Label.assistive : Label.strong)};
  ${typographyCss(Typography.headline2.medium)}
`;

const NameCell = styled(BodyCell)`
  ${typographyCss(Typography.headline1.bold)}
`;

// 이름만 링크로 두고 누르는 영역을 행 전체로 넓혀, 행 어디를 눌러도 상세로 이동한다
const RowLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  outline: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 6px;
  }

  &:focus-visible::after {
    outline: auto;
  }
`;

// Figma 페이지 이동 영역은 높이 50px이라 공통 컴포넌트(32px) 위아래에 여백을 더한다
const Pagination = styled(PaginationNavigation)`
  padding: 9px 0;
`;
