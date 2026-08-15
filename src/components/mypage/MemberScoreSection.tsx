import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { UserProfile } from '@@types/request';
import { MemberScore, getMemberScores } from 'src/apis/mypage';
import useTokenStore from 'src/store/useTokenStore';
import { BackgroundColor, Black, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const ALL_PART = '전체';

/**
 * 아기사자 출결/과제 현황 (운영진·회장·관리자 공용)
 * 조회 범위는 서버가 역할로 판단한다 — 운영진은 본인 파트, 회장/관리자는 전체.
 * 기수·파트 구분은 응답 목록을 프론트에서 필터링해 보여준다.
 * 운영진은 현재 기수 + 본인 파트로 고정되어 필터를 바꿀 수 없다.
 */
const MemberScoreSection = ({ userProfile }: { userProfile: UserProfile }) => {
  const tokenState = useTokenStore((state) => state.token);
  const isFixedScope = userProfile.role === 'STAFF';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['memberScores'],
    queryFn: () => getMemberScores(tokenState),
    enabled: !!tokenState.access,
  });
  const scores = useMemo(() => data ?? [], [data]);

  const generationOptions = useMemo(
    () => Array.from(new Set(scores.map((score) => score.generationNumber))).sort((a, b) => b - a),
    [scores],
  );
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const latestGeneration = generationOptions[0] != null ? String(generationOptions[0]) : '';
  // 운영진은 현재 기수 고정
  const currentGeneration = isFixedScope ? latestGeneration : selectedGeneration || latestGeneration;

  const partOptions = useMemo(() => {
    const parts = scores
      .filter((score) => String(score.generationNumber) === currentGeneration)
      .map((score) => score.partName);
    return [ALL_PART, ...Array.from(new Set(parts))];
  }, [scores, currentGeneration]);
  const [selectedPart, setSelectedPart] = useState(ALL_PART);
  // 운영진은 본인 파트 고정
  const currentPart = isFixedScope ? userProfile.partName : selectedPart;

  const rows = scores.filter(
    (score) =>
      String(score.generationNumber) === currentGeneration &&
      (currentPart === ALL_PART || score.partName === currentPart),
  );

  return (
    <Section>
      <SectionTitle>아기사자 출결/과제 현황</SectionTitle>

      {isLoading ? (
        <LoadingWrapper>
          <LinearLoading />
        </LoadingWrapper>
      ) : isError ? (
        <EmptyState variant="error" />
      ) : (
        <>
          <FilterRow>
            <FilterSelect
              heading="기수 구분"
              ariaLabel="기수 선택"
              value={currentGeneration}
              options={generationOptions.map(String)}
              onChange={setSelectedGeneration}
              disabled={isFixedScope}
            />
            <FilterSelect
              heading="파트 구분"
              ariaLabel="파트 선택"
              value={currentPart}
              options={partOptions}
              onChange={setSelectedPart}
              disabled={isFixedScope}
            />
          </FilterRow>

          <Table>
            <HeaderRow>
              <HeadCell $width={90}>아기사자</HeadCell>
              <HeadCell $width={50}>기수</HeadCell>
              <HeadCell $width={92}>파트</HeadCell>
              <HeadCell $width={50}>지각</HeadCell>
              <HeadCell $width={50}>결석</HeadCell>
              <HeadCell $width={63}>무단결석</HeadCell>
              <HeadCell $width={63}>지각제출</HeadCell>
              <HeadCell $width={50}>미제출</HeadCell>
              <HeadCell $width={80} $sticky>
                총점
              </HeadCell>
            </HeaderRow>

            <Body>
              {rows.map((score) => (
                <Row key={score.memberId}>
                  <Name>{score.name}</Name>
                  <Value $width={50} $center>
                    {score.generationNumber}
                  </Value>
                  <Value $width={92}>{score.partName}</Value>
                  <CountCell width={50} value={score.lateCount} />
                  <CountCell width={50} value={score.absentCount} />
                  <CountCell width={63} value={score.unauthorizedAbsentCount} />
                  <CountCell width={63} value={score.lateSubmitCount} />
                  <CountCell width={50} value={score.missedCount} />
                  <Total>{score.total}점</Total>
                </Row>
              ))}
            </Body>
          </Table>
        </>
      )}
    </Section>
  );
};

export default MemberScoreSection;

// 0회가 아니면 강조 (Figma: Orange/O500)
const CountCell = ({ width, value }: { width: number; value: number }) => (
  <Value $width={width} $center $highlight={value > 0}>
    {value}회
  </Value>
);

const FilterSelect = ({
  heading,
  ariaLabel,
  value,
  options,
  onChange,
  disabled = false,
}: {
  heading: string;
  ariaLabel: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options,
    value,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onSelect: onChange,
  });

  return (
    <SelectColumn ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <Select
        ref={triggerRef}
        heading={heading}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        value={value}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {!disabled && isOpen && (
        <ListboxOptions
          listId={listId}
          options={options}
          value={value}
          activeIndex={activeIndex}
          onSelect={selectOption}
        />
      )}
    </SelectColumn>
  );
};

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  /* 표(min-width 880px)가 페이지 폭을 밀어내지 않도록 */
  min-width: 0;
`;

const SectionTitle = styled.p`
  margin: 0;
  width: 100%;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const SelectColumn = styled.div`
  position: relative;
  width: 160px;

  @media (max-width: 900px) {
    flex: 1;
    min-width: 0;
    width: auto;
  }
`;

const TABLE_MIN_WIDTH = 880;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  margin-top: 40px;

  /* 좁은 화면에서는 컬럼을 줄이지 않고 표 전체를 가로로 스크롤한다 */
  @media (max-width: 900px) {
    overflow-x: auto;
    /* 스크롤바가 마지막 행에 겹치지 않도록 아래 여백 확보 */
    padding-bottom: 16px;
  }
`;

const rowLayout = `
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: ${TABLE_MIN_WIDTH}px;
`;

const HeaderRow = styled.div`
  ${rowLayout}
`;

// 가로 스크롤 시 총점은 오른쪽에 고정하고, 왼쪽에 흰색 페이드를 둔다 (Figma)
const stickyRightCss = `
  @media (max-width: 900px) {
    position: sticky;
    right: 0;
    z-index: 1;
    background-color: ${BackgroundColor};

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: -40px;
      width: 40px;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), ${BackgroundColor});
      pointer-events: none;
    }
  }
`;

const HeadCell = styled.span<{ $width: number; $sticky?: boolean }>`
  width: ${(props) => props.$width}px;
  text-align: ${(props) => (props.$width === 90 || props.$width === 92 ? 'left' : 'center')};
  color: ${Label.assistive};
  ${typographyCss(Typography.body1Reading.regular)}

  ${(props) => props.$sticky && stickyRightCss}
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 32px;
`;

// Figma: 행(32px) 아래 26px → 구분선 → 26px → 다음 행
const Row = styled.div`
  ${rowLayout}

  & + & {
    margin-top: 26px;
  }

  &:not(:last-child) {
    padding-bottom: 26px;
    border-bottom: 1px solid ${Line.normal};
  }
`;

const Name = styled.span`
  width: 90px;

  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const Value = styled.span<{ $width: number; $center?: boolean; $highlight?: boolean }>`
  width: ${(props) => props.$width}px;
  text-align: ${(props) => (props.$center ? 'center' : 'left')};
  color: ${(props) => (props.$highlight ? Orange.o500 : Black.b900)};
  ${typographyCss(Typography.heading2.medium)}
`;

const Total = styled.span`
  width: 80px;
  text-align: center;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}

  ${stickyRightCss}
`;
