import { useState } from 'react';
import styled from 'styled-components';

import Modal, { ModalActions, ModalInformation, ModalTitle } from '@common/modal/Modal';
import TextSelect from '@common/select/TextSelect';
import TextButton from '@common/textButton/TextButton';
import { IcChevronRight } from '@assets/svg';
import { DashboardCount } from '@utils/recruitDashboard';
import { BackgroundWhite, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { Caption } from './DistributionPieChart';

const TOP_COUNT = 3;
const ALL_PARTS = '전체';

export interface MajorRankingProps {
  majors: DashboardCount[];
  majorsByPart: Record<string, DashboardCount[]>;
}

const MajorRanking = ({ majors, majorsByPart }: MajorRankingProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [part, setPart] = useState(ALL_PARTS);
  // 지원자가 없으면 Figma처럼 빈 순위 3줄을 둔다
  const topRows = Array.from({ length: TOP_COUNT }, (_, index) => majors[index] ?? { label: '-', count: 0 });
  const modalRows = part === ALL_PARTS ? majors : (majorsByPart[part] ?? []);

  return (
    <Root>
      <Box>
        {topRows.map((row, index) => (
          <Row key={`${row.label}-${index}`}>
            <Rank>{index + 1}</Rank>
            <Name title={row.label}>{row.label}</Name>
            <Count>{row.count}명</Count>
          </Row>
        ))}
        <More>
          <TextButton
            size="small"
            disabled={majors.length === 0}
            trailingIcon={<IcChevronRight />}
            onClick={() => setIsModalOpen(true)}
          >
            더보기
          </TextButton>
        </More>
      </Box>
      <Caption>학과</Caption>
      {isModalOpen && (
        <RankingModal ariaLabel="지원자 분포 학과 순위" onClose={() => setIsModalOpen(false)}>
          <Information>
            <ModalHeader>
              <ModalTitle>지원자 분포 학과 순위</ModalTitle>
              <TextSelect
                ariaLabel="파트"
                options={[ALL_PARTS, ...Object.keys(majorsByPart)]}
                value={part}
                onChange={setPart}
              />
            </ModalHeader>
            <ModalRows>
              {modalRows.map((row, index) => (
                <ModalRow key={row.label}>
                  <Rank>{index + 1}</Rank>
                  <ModalName title={row.label}>{row.label}</ModalName>
                  <ModalCount>{row.count}명</ModalCount>
                </ModalRow>
              ))}
            </ModalRows>
          </Information>
          <ModalActions>
            <TextButton color="primary" onClick={() => setIsModalOpen(false)}>
              닫기
            </TextButton>
          </ModalActions>
        </RankingModal>
      )}
    </Root>
  );
};

export default MajorRanking;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 16px;
  width: 261.33px;
  height: 286.67px;
`;

const Box = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 16px;
  background-color: ${BackgroundWhite.tertiary};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  color: ${Label.strong};
  ${typographyCss(Typography.heading2.medium)}
`;

const Rank = styled.span`
  flex-shrink: 0;
  width: 28px;
  text-align: center;
`;

const Name = styled.span`
  flex: 1 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Count = styled.span`
  flex-shrink: 0;
  min-width: 50px;
  text-align: right;
  ${typographyCss(Typography.heading2.bold)}
`;

const More = styled.div`
  display: flex;
  flex: 1 0 0;
  align-items: flex-end;
  justify-content: flex-end;
  padding-bottom: 12px;
`;

// Figma 학과 순위 모달은 공통 모달보다 좁고(340px) 모서리가 크다(16px)
const RankingModal = styled(Modal)`
  && {
    width: 340px;
    min-width: 0;
    max-width: calc(100vw - 40px);
    border-radius: 16px;
  }
`;

const Information = styled(ModalInformation)`
  && {
    gap: 20px;
    padding: 28px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${ModalTitle} {
    ${typographyCss(Typography.headline1.bold)}
  }
`;

// Figma 10줄 높이까지만 보여 주고, 학과가 더 많으면 목록 안에서 스크롤한다
const ModalRows = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 432px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${Label.strong};
  opacity: 0.8;
`;

const ModalRow = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  ${typographyCss(Typography.body2Normal.medium)}
`;

const ModalName = styled(Name)`
  flex: 0 1 140px;
  margin-right: auto;
`;

const ModalCount = styled.span`
  flex-shrink: 0;
  min-width: 50px;
  text-align: right;
  ${typographyCss(Typography.body2Normal.bold)}
`;
