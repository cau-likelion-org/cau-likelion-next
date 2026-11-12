import { forwardRef, useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Checkbox from '@common/checkbox/Checkbox';
import EmptyState from '@common/emptyState/EmptyState';
import PaginationNavigation from '@common/pagination/PaginationNavigation';
import TextSelect from '@common/select/TextSelect';
import TextField from '@common/textField/TextField';
import ProjectFilterSelect from '@project/projects/ProjectFilterSelect';
import { PART_OPTIONS_MOCK } from '@recruit/apply/mock';
import { IcSearch } from '@assets/svg';
import { Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { ApplicantDetail, SCREENING_RESULT_LABEL, SUBMISSION_STATUS_LABEL, ScreeningResult } from '../applicantMock';
import ResultSection, { BorderBox, GrayBox, Inset } from './ResultSection';
import { InterviewInfo, ScreeningStage } from './resultMock';

const PAGE_SIZE = 6;
const ALL = '전체';
const UNSET = '미입력';
const RESULTS: ScreeningResult[] = ['PASS', 'FAIL', 'HOLD'];
const toResult = (label: string) => RESULTS.find((result) => SCREENING_RESULT_LABEL[result] === label);

export interface ResultInputSectionProps {
  title: string;
  stage: ScreeningStage;
  applicants: ApplicantDetail[];
  isPublished: boolean;
  interviews: Record<number, InterviewInfo>;
  pending: Record<number, ScreeningResult>;
  selectedIds: number[];
  saving: boolean;
  onPendingChange: (pending: Record<number, ScreeningResult>) => void;
  onSelectedIdsChange: (ids: number[]) => void;
  onSave: () => void;
}

export const getSavedResult = (stage: ScreeningStage, applicant: ApplicantDetail) =>
  stage === 'DOCUMENT' ? applicant.documentResult : applicant.interviewResult;

const ResultInputSection = forwardRef<HTMLElement, ResultInputSectionProps>(function ResultInputSection(
  {
    title,
    stage,
    applicants,
    isPublished,
    interviews,
    pending,
    selectedIds,
    saving,
    onPendingChange,
    onSelectedIdsChange,
    onSave,
  },
  ref,
) {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [partFilter, setPartFilter] = useState(ALL);
  const [resultFilter, setResultFilter] = useState(ALL);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const currentResult = (applicant: ApplicantDetail) => pending[applicant.id] ?? getSavedResult(stage, applicant);
  // 공개 후에는 합격·불합격을 보류로 되돌릴 수 없다
  const canHold = (applicant: ApplicantDetail) => !isPublished || !getSavedResult(stage, applicant);

  const trimmedKeyword = keyword.trim();
  const filtered = applicants.filter((applicant) => {
    if (statusFilter !== ALL && SUBMISSION_STATUS_LABEL[applicant.submissionStatus] !== statusFilter) return false;
    if (partFilter !== ALL && applicant.part !== partFilter) return false;
    const result = currentResult(applicant);
    if (resultFilter !== ALL && (result ? SCREENING_RESULT_LABEL[result] : UNSET) !== resultFilter) return false;
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

  const setResults = (ids: number[], result: ScreeningResult) => {
    const next = { ...pending };
    ids.forEach((id) => {
      const applicant = applicants.find((item) => item.id === id);
      if (!applicant) return;
      if (getSavedResult(stage, applicant) === result) delete next[id];
      else next[id] = result;
    });
    onPendingChange(next);
  };

  const toggleSelected = (id: number, checked: boolean) =>
    onSelectedIdsChange(checked ? [...selectedIds, id] : selectedIds.filter((selectedId) => selectedId !== id));

  const selectedApplicants = applicants.filter((applicant) => selectedIds.includes(applicant.id));
  const counts = RESULTS.map((result) => ({
    label: SCREENING_RESULT_LABEL[result],
    count: applicants.filter((applicant) => currentResult(applicant) === result).length,
  }));
  const unsetCount = applicants.filter((applicant) => !currentResult(applicant)).length;

  const applyBulk = (result: ScreeningResult) => {
    setResults(selectedIds, result);
    onSelectedIdsChange([]);
  };

  return (
    <ResultSection
      ref={ref}
      title={title}
      counts={[...counts, { label: UNSET, count: unsetCount, tone: unsetCount > 0 ? 'accent' : 'normal' }]}
      saveDisabled={Object.keys(pending).length === 0}
      saving={saving}
      onSave={onSave}
    >
      {stage === 'DOCUMENT' && (
        <BorderBox>
          <NoticeTitle>미제출자는 결과 입력 대상에서 제외됩니다</NoticeTitle>
          <NoticeText>면접 전형 탭에는 서류 합격자만 표시되며 서류 결과 공개 후 입력할 수 있습니다.</NoticeText>
        </BorderBox>
      )}
      <Inset>
        <Filters>
          {stage === 'DOCUMENT' && (
            <FilterSelect
              heading="제출 상태"
              options={[ALL, SUBMISSION_STATUS_LABEL.ON_TIME, SUBMISSION_STATUS_LABEL.LATE]}
              value={statusFilter}
              onChange={changeFilter(setStatusFilter)}
            />
          )}
          <FilterSelect
            heading="파트 구분"
            options={[ALL, ...PART_OPTIONS_MOCK]}
            value={partFilter}
            onChange={changeFilter(setPartFilter)}
          />
          <FilterSelect
            heading="결과"
            options={[ALL, ...RESULTS.map((result) => SCREENING_RESULT_LABEL[result]), UNSET]}
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
        <GrayBox>
          <BulkLabel>일괄변경</BulkLabel>
          <BulkCount>선택 {selectedIds.length}명</BulkCount>
          <Button size="small" disabled={selectedIds.length === 0} onClick={() => applyBulk('PASS')}>
            합격
          </Button>
          <Button size="small" color="assistive" disabled={selectedIds.length === 0} onClick={() => applyBulk('FAIL')}>
            불합격
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={selectedIds.length === 0 || !selectedApplicants.every(canHold)}
            onClick={() => applyBulk('HOLD')}
          >
            보류
          </Button>
        </GrayBox>
        {filtered.length === 0 ? (
          <Empty message={applicants.length === 0 ? '결과를 입력할 지원자가 없습니다' : '검색 결과가 없습니다'} />
        ) : (
          <TableArea>
            <Table role="table" aria-label={title}>
              <Row role="row">
                <HeaderCell role="columnheader" $width={68}>
                  선택
                </HeaderCell>
                <HeaderCell role="columnheader" $width={90}>
                  이름
                </HeaderCell>
                <HeaderCell role="columnheader" $width={120}>
                  학번
                </HeaderCell>
                <HeaderCell role="columnheader" $width={120}>
                  파트
                </HeaderCell>
                {stage === 'DOCUMENT' ? (
                  <HeaderCell role="columnheader" $width={80}>
                    제출 상태
                  </HeaderCell>
                ) : (
                  <HeaderCell role="columnheader" $width={186}>
                    면접 일시
                  </HeaderCell>
                )}
                <HeaderCell role="columnheader" $width={80}>
                  {stage === 'DOCUMENT' ? '서류 결과' : '면접 결과'}
                </HeaderCell>
              </Row>
              <Rows>
                {pageItems.map((applicant) => {
                  const result = currentResult(applicant);
                  const interview = interviews[applicant.id];
                  const options = RESULTS.filter((item) => item !== 'HOLD' || canHold(applicant)).map(
                    (item) => SCREENING_RESULT_LABEL[item],
                  );
                  return (
                    <BodyRow key={applicant.id} role="row">
                      <CheckCell role="cell">
                        <Checkbox
                          ariaLabel={`${applicant.name} 선택`}
                          checked={selectedIds.includes(applicant.id)}
                          onChange={(checked) => toggleSelected(applicant.id, checked)}
                        />
                      </CheckCell>
                      <NameCell role="cell" $width={90}>
                        {applicant.name}
                      </NameCell>
                      <BodyCell role="cell" $width={120}>
                        {applicant.studentId}
                      </BodyCell>
                      <BodyCell role="cell" $width={120}>
                        {applicant.part}
                      </BodyCell>
                      {stage === 'DOCUMENT' ? (
                        <BodyCell role="cell" $width={80}>
                          {SUBMISSION_STATUS_LABEL[applicant.submissionStatus]}
                        </BodyCell>
                      ) : (
                        <BodyCell role="cell" $width={186}>
                          {interview ? `${interview.date.replace(/-/g, '/')} ${interview.time}` : '-'}
                        </BodyCell>
                      )}
                      <ResultCell role="cell">
                        <TextSelect
                          tone="cell"
                          ariaLabel={`${applicant.name} 결과`}
                          placeholder={UNSET}
                          options={options}
                          value={result ? SCREENING_RESULT_LABEL[result] : ''}
                          onChange={(label) => {
                            const next = toResult(label);
                            if (next) setResults([applicant.id], next);
                          }}
                        />
                      </ResultCell>
                    </BodyRow>
                  );
                })}
              </Rows>
            </Table>
            <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={setPage} />
          </TableArea>
        )}
      </Inset>
    </ResultSection>
  );
});

export default ResultInputSection;

const NoticeTitle = styled.p`
  margin: 0;
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}
`;

const NoticeText = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.medium)}
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

const BulkLabel = styled.span`
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const BulkCount = styled.span`
  flex: 1 0 0;
  color: ${Label.strong};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const Empty = styled(EmptyState)`
  padding: 60px 0;
`;

const TableArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyRow = styled(Row)`
  padding: 20px 0;

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

const HeaderCell = styled.span<{ $width: number }>`
  flex-shrink: 0;
  width: ${(props) => props.$width}px;
  color: ${Label.assistive};
  ${typographyCss(Typography.headline1.medium)}
`;

const BodyCell = styled.span<{ $width: number }>`
  flex-shrink: 0;
  width: ${(props) => props.$width}px;
  padding: 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${Label.strong};
  ${typographyCss(Typography.headline2.medium)}
`;

const NameCell = styled(BodyCell)`
  ${typographyCss(Typography.headline1.bold)}
`;

const CheckCell = styled.span`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  width: 68px;
`;

const ResultCell = styled.span`
  flex-shrink: 0;
  width: 80px;
`;

// Figma 페이지 이동 영역은 높이 50px이라 공통 컴포넌트(32px) 위아래에 여백을 더한다
const Pagination = styled(PaginationNavigation)`
  padding: 9px 0;
`;
