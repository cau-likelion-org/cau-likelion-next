import styled from 'styled-components';

import { Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { ROADMAP_MONTHS, ROADMAP_ROWS } from '../data';

const LABEL_WIDTH = 131;
const ROW_GAP = 13;

const RoadmapChart = () => {
  return (
    <Wrapper>
      <ScrollArea>
        <HeaderRow>
          <LabelSpacer />
          <MonthsRow>
            {ROADMAP_MONTHS.map((month) => (
              <Month key={month}>{month}</Month>
            ))}
          </MonthsRow>
        </HeaderRow>
        <Divider />
        <Rows>
          {ROADMAP_ROWS.map((row) => (
            <Row key={row.label}>
              <RowLabel>{row.label}</RowLabel>
              <Track>
                <Bar left={row.leftPercent} width={row.widthPercent} />
              </Track>
            </Row>
          ))}
        </Rows>
      </ScrollArea>
    </Wrapper>
  );
};

export default RoadmapChart;

const Wrapper = styled.div`
  width: 100%;
  padding: 35px;
  border-radius: 24px;
  background-color: #ffffff;
  overflow-x: auto;

  @media (max-width: 700px) {
    padding: 24px;
  }
`;

const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  min-width: 700px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${ROW_GAP}px;
  width: 100%;
`;

const LabelSpacer = styled.div`
  flex-shrink: 0;
  width: ${LABEL_WIDTH}px;
`;

const MonthsRow = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
`;

const Month = styled.p`
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  text-align: center;
  color: ${Label.normal};
  ${typographyCss(Typography.heading1.bold)}
`;

const Divider = styled.hr`
  margin: 0;
  width: 100%;
  border: none;
  border-top: 1px solid ${Line.subtle};
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 21px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${ROW_GAP}px;
  width: 100%;
`;

const RowLabel = styled.p`
  margin: 0;
  flex-shrink: 0;
  width: ${LABEL_WIDTH}px;
  color: ${Label.normal};
  ${typographyCss(Typography.heading1.medium)}
`;

const Track = styled.div`
  position: relative;
  flex: 1 0 0;
  min-width: 0;
  height: 33px;
`;

const Bar = styled.div<{ left: number; width: number }>`
  position: absolute;
  top: 0;
  height: 100%;
  left: ${(props) => props.left}%;
  width: ${(props) => props.width}%;
  border-radius: 4px;
  background-color: ${Orange.o500};
`;
