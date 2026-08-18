import { useState } from 'react';
import styled from 'styled-components';

import ContentBadge from '@common/badge/ContentBadge';
import Tooltip from '@common/tooltip/Tooltip';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

export type WeeklyAttendanceStatus = 'before' | 'present' | 'late' | 'absent' | 'unauthorized' | 'excused';

export interface WeeklyAttendanceRecord {
  week: number;
  date: string;
  status: WeeklyAttendanceStatus;
  checkInTime?: string;
  reason?: string;
}

const BADGE_CONFIG: Record<
  WeeklyAttendanceStatus,
  { label: string; color: 'neutral' | 'accent'; variant: 'solid' | 'outlined' }
> = {
  before: { label: '출석 전', color: 'neutral', variant: 'solid' },
  present: { label: '출석', color: 'accent', variant: 'solid' },
  late: { label: '지각', color: 'accent', variant: 'outlined' },
  absent: { label: '결석', color: 'neutral', variant: 'solid' },
  unauthorized: { label: '무단결석', color: 'neutral', variant: 'solid' },
  excused: { label: '공결', color: 'accent', variant: 'outlined' },
};

const WeeklyAttendanceCard = ({ record }: { record: WeeklyAttendanceRecord }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const badge = BADGE_CONFIG[record.status];

  return (
    <Card>
      <Left>
        <Week>{record.week}주차 세션</Week>
        <SessionDate>{record.date}</SessionDate>
      </Left>
      <Right>
        {record.checkInTime && <CheckInTime>{record.checkInTime}</CheckInTime>}
        <BadgeSlot
          type="button"
          $interactive={!!record.reason}
          aria-label={record.reason ? `${badge.label} 사유 보기` : undefined}
          aria-expanded={record.reason ? isTooltipVisible : undefined}
          onClick={() => record.reason && setIsTooltipVisible((prev) => !prev)}
          onMouseEnter={() => record.reason && setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          onBlur={() => setIsTooltipVisible(false)}
        >
          <ContentBadge text={badge.label} color={badge.color} variant={badge.variant} size="medium" />
          {isTooltipVisible && record.reason && (
            <TooltipSlot>
              <Tooltip size="medium" position="bottom" align="end" text={record.reason} />
            </TooltipSlot>
          )}
        </BadgeSlot>
      </Right>
    </Card>
  );
};

export default WeeklyAttendanceCard;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  border: 1px solid ${Line.subtle};

  @media${media.xs} {
    align-items: flex-start;
    padding: 14px;
  }
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media${media.xs} {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
`;

const Week = styled.p`
  margin: 0;
  width: 120px;

  @media${media.xs} {
    width: auto;
  }

  color: ${Label.normal};
  ${typographyCss(Typography.heading1.bold)}
`;

const SessionDate = styled.p`
  margin: 0;
  white-space: nowrap;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 312px;

  @media${media.xs} {
    flex-direction: column-reverse;
    align-items: flex-end;
    justify-content: center;
    gap: 12px;
    width: auto;
  }
`;

const CheckInTime = styled.p`
  margin: 0;
  white-space: nowrap;
  color: ${Label.assistive};
  ${typographyCss(Typography.label1Normal.regular)}
`;

const BadgeSlot = styled.button<{ $interactive: boolean }>`
  position: relative;
  display: inline-flex;
  padding: 0;
  border: none;
  background: none;
  cursor: ${(props) => (props.$interactive ? 'pointer' : 'default')};
`;

/* Figma: 뱃지 아래 2px, 화살표(우측 8px 인셋 + 반폭 10px)가 뱃지 중앙을 가리키도록 오른쪽 정렬.
   가운데 정렬하면 뱃지가 카드 오른쪽 끝에 있는 모바일에서 툴팁이 화면 밖으로 넘친다. */
const TooltipSlot = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  right: calc(50% - 18px);
  z-index: 10;
  width: max-content;
`;
