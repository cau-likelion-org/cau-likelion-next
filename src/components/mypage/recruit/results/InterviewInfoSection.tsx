import { forwardRef, useState } from 'react';
import styled from 'styled-components';

import DateTimeInput from '@common/dateTimeInput/DateTimeInput';
import EmptyState from '@common/emptyState/EmptyState';
import PaginationNavigation from '@common/pagination/PaginationNavigation';
import HorizontalScrollArea from '@common/scrollArea/HorizontalScrollArea';
import TextField from '@common/textField/TextField';
import Tooltip from '@common/tooltip/Tooltip';
import { formatInterviewSlots } from '@utils/index';
import { INTERVIEW_WARNING, getInterviewWarnings } from '@utils/recruitResult';
import { Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { ApplicantDetail } from '../applicantMock';
import { RECRUIT_INTERVIEW_SETTING_MOCK } from '../mock';
import ResultSection, { Inset } from './ResultSection';
import { InterviewInfo } from './resultMock';

const PAGE_SIZE = 4;
const EMPTY_INFO: InterviewInfo = { date: '', time: '', place: '' };

export const isInterviewInfoFilled = (info?: InterviewInfo) => !!info?.date && !!info.time && !!info.place.trim();

export interface InterviewInfoSectionProps {
  title: string;
  applicants: ApplicantDetail[];
  interviews: Record<number, InterviewInfo>;
  pending: Record<number, InterviewInfo>;
  saving: boolean;
  onPendingChange: (pending: Record<number, InterviewInfo>) => void;
  onSave: () => void;
}

const InterviewInfoSection = forwardRef<HTMLElement, InterviewInfoSectionProps>(function InterviewInfoSection(
  { title, applicants, interviews, pending, saving, onPendingChange, onSave },
  ref,
) {
  const [page, setPage] = useState(1);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const infoOf = (id: number) => pending[id] ?? interviews[id] ?? EMPTY_INFO;
  const filledCount = applicants.filter((applicant) => isInterviewInfoFilled(infoOf(applicant.id))).length;

  const sameTimeCounts = applicants.reduce<Record<string, number>>((acc, applicant) => {
    const { date, time } = infoOf(applicant.id);
    if (date && time) acc[`${date}T${time}`] = (acc[`${date}T${time}`] ?? 0) + 1;
    return acc;
  }, {});

  const totalPage = Math.max(1, Math.ceil(applicants.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPage);
  const pageItems = applicants.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const changeInfo = (id: number, patch: Partial<InterviewInfo>) =>
    onPendingChange({ ...pending, [id]: { ...infoOf(id), ...patch } });

  return (
    <ResultSection
      ref={ref}
      title={title}
      counts={[
        { label: '서류 합격자 총', count: applicants.length },
        { label: '입력', count: filledCount },
        {
          label: '미입력',
          count: applicants.length - filledCount,
          tone: applicants.length - filledCount > 0 ? 'accent' : 'normal',
        },
      ]}
      saveDisabled={Object.keys(pending).length === 0}
      saving={saving}
      onSave={onSave}
    >
      <Inset>
        {applicants.length === 0 ? (
          <Empty message="서류 합격자가 없습니다" />
        ) : (
          <TableArea>
            <HorizontalScrollArea trackGap={40}>
              <Table role="table" aria-label={title}>
                <Row role="row">
                  <HeaderCell role="columnheader" $width={90}>
                    이름
                  </HeaderCell>
                  <HeaderCell role="columnheader" $width={120}>
                    파트
                  </HeaderCell>
                  <HeaderCell role="columnheader" $width={160}>
                    선택한 면접 가능 시간
                  </HeaderCell>
                  <HeaderCell role="columnheader" $width={394}>
                    면접 일시
                  </HeaderCell>
                  <HeaderCell role="columnheader" $width={240}>
                    면접 대기 장소
                  </HeaderCell>
                </Row>
                <Rows>
                  {pageItems.map((applicant) => {
                    const info = infoOf(applicant.id);
                    const warnings = getInterviewWarnings({
                      date: info.date,
                      time: info.time,
                      selectedSlots: applicant.interviewSlots,
                      period: RECRUIT_INTERVIEW_SETTING_MOCK,
                      sameTimeCount: sameTimeCounts[`${info.date}T${info.time}`] ?? 0,
                    });
                    const dateWarnings = warnings.filter(
                      (warning) =>
                        warning === INTERVIEW_WARNING.notSelected || warning === INTERVIEW_WARNING.outOfPeriod,
                    );
                    const anchorProps = (key: string) => ({
                      onMouseEnter: () => setHoveredKey(key),
                      onMouseLeave: () => setHoveredKey(null),
                      onFocus: () => setHoveredKey(key),
                      onBlur: () => setHoveredKey(null),
                    });
                    return (
                      <BodyRow key={applicant.id} role="row">
                        <NameCell role="cell" $width={90}>
                          {applicant.name}
                        </NameCell>
                        <BodyCell role="cell" $width={120}>
                          {applicant.part}
                        </BodyCell>
                        <SlotCell role="cell" tabIndex={0}>
                          {formatInterviewSlots(applicant.interviewSlots, RECRUIT_INTERVIEW_SETTING_MOCK.unitMinutes)}
                        </SlotCell>
                        <DateTimeCell role="cell">
                          <InputAnchor {...anchorProps(`${applicant.id}-date`)}>
                            <DateTimeInput
                              type="date"
                              aria-label={`${applicant.name} 면접 날짜`}
                              value={info.date}
                              highlight={dateWarnings.length > 0}
                              onChange={(date) => changeInfo(applicant.id, { date })}
                            />
                            {hoveredKey === `${applicant.id}-date` && dateWarnings.length > 0 && (
                              <WarningTooltip position="top" align="center" text={dateWarnings.join('\n')} />
                            )}
                          </InputAnchor>
                          <InputAnchor {...anchorProps(`${applicant.id}-time`)}>
                            <DateTimeInput
                              type="time"
                              aria-label={`${applicant.name} 면접 시각`}
                              placeholder="00:00"
                              value={info.time}
                              highlight={warnings.length > 0}
                              onChange={(time) => changeInfo(applicant.id, { time })}
                            />
                            {hoveredKey === `${applicant.id}-time` && warnings.length > 0 && (
                              <WarningTooltip position="top" align="center" text={warnings.join('\n')} />
                            )}
                          </InputAnchor>
                        </DateTimeCell>
                        <PlaceField
                          aria-label={`${applicant.name} 면접 대기 장소`}
                          placeholder="대기 장소 입력"
                          value={info.place}
                          onChange={(event) => changeInfo(applicant.id, { place: event.target.value })}
                        />
                      </BodyRow>
                    );
                  })}
                </Rows>
              </Table>
            </HorizontalScrollArea>
            <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={setPage} />
          </TableArea>
        )}
      </Inset>
    </ResultSection>
  );
});

export default InterviewInfoSection;

const Empty = styled(EmptyState)`
  padding: 60px 0;
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

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
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
  padding: 11px 0;
  color: ${Label.strong};
  ${typographyCss(Typography.headline2.medium)}
`;

const NameCell = styled(BodyCell)`
  ${typographyCss(Typography.headline1.bold)}
`;

const SlotCell = styled(BodyCell).attrs({ $width: 160 })`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  outline: none;

  &:hover,
  &:focus {
    white-space: normal;
  }
`;

const DateTimeCell = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 20px;
  width: 394px;
`;

const InputAnchor = styled.div`
  position: relative;
  flex: 1 0 0;
`;

const WarningTooltip = styled(Tooltip)`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  z-index: 10;
  width: max-content;
  white-space: pre-line;
  transform: translateX(-50%);
`;

const PlaceField = styled(TextField)`
  flex-shrink: 0;
  width: 240px;
`;

// Figma 페이지 이동 영역은 높이 50px이라 공통 컴포넌트(32px) 위아래에 여백을 더한다
const Pagination = styled(PaginationNavigation)`
  padding: 9px 0;
`;
