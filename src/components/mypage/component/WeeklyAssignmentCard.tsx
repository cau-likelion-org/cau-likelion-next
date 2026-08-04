import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ContentBadge from '@common/badge/ContentBadge';
import { IcChevronDown } from '@assets/svg';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type WeeklyAssignmentStatus = 'before' | 'late' | 'missed' | 'done';
export type AssignmentItemStatus = 'before' | 'pending' | 'rejected' | 'approved' | 'missed';

export interface AssignmentItem {
  name: string;
  status: AssignmentItemStatus;
  submittedAt?: string;
}

export interface AssignmentCard {
  id?: string;
  items: AssignmentItem[];
  dueDate: string;
  actionLabel?: '수정하기' | '제출하기';
}

export interface WeeklyAssignmentGroup {
  week: number;
  status: WeeklyAssignmentStatus;
  cards: AssignmentCard[];
}

const WEEK_BADGE_CONFIG: Record<WeeklyAssignmentStatus, { label: string; color: 'neutral' | 'accent' }> = {
  before: { label: '제출 전', color: 'neutral' },
  late: { label: '지각 제출', color: 'neutral' },
  missed: { label: '미제출', color: 'neutral' },
  done: { label: '제출 완료', color: 'accent' },
};

const ITEM_BADGE_CONFIG: Record<AssignmentItemStatus, { label: string; color: 'neutral' | 'accent' }> = {
  before: { label: '제출 전', color: 'neutral' },
  pending: { label: '승인 대기', color: 'neutral' },
  rejected: { label: '승인 반려', color: 'neutral' },
  approved: { label: '승인 완료', color: 'accent' },
  missed: { label: '미제출', color: 'neutral' },
};

const WeeklyAssignmentCard = ({ group }: { group: WeeklyAssignmentGroup }) => {
  const [isOpen, setIsOpen] = useState(true);
  const weekBadge = WEEK_BADGE_CONFIG[group.status];

  return (
    <Wrapper>
      <Header type="button" onClick={() => setIsOpen((prev) => !prev)} aria-expanded={isOpen}>
        <WeekTitle>{group.week}주차 세션 과제</WeekTitle>
        <HeaderRight>
          <ContentBadge text={weekBadge.label} color={weekBadge.color} variant="solid" size="medium" />
          <Chevron $open={isOpen}>
            <IcChevronDown width={20} height={20} />
          </Chevron>
        </HeaderRight>
      </Header>
      {isOpen &&
        group.cards.map((card, cardIndex) => (
          <GroupCard key={cardIndex}>
            {card.items.map((item, itemIndex) => {
              const itemBadge = ITEM_BADGE_CONFIG[item.status];
              return (
                <ItemRow key={itemIndex}>
                  <ItemName>{item.name}</ItemName>
                  <ItemRight>
                    {item.submittedAt && <SubmittedAt>{item.submittedAt}</SubmittedAt>}
                    <ContentBadge text={itemBadge.label} color={itemBadge.color} variant="solid" size="medium" />
                  </ItemRight>
                </ItemRow>
              );
            })}
            <FooterRow>
              <DueDate>
                마감일 <span>ㅣ</span> {card.dueDate}
              </DueDate>
              {card.actionLabel &&
                (card.id ? (
                  <Link href={`/mypage/assignment/${card.id}`}>
                    <Button size="large">{card.actionLabel}</Button>
                  </Link>
                ) : (
                  <Button size="large">{card.actionLabel}</Button>
                ))}
            </FooterRow>
          </GroupCard>
        ))}
    </Wrapper>
  );
};

export default WeeklyAssignmentCard;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

const Header = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
  cursor: pointer;
`;

const WeekTitle = styled.p`
  margin: 0;
  color: ${Label.strong};
  ${typographyCss(Typography.heading1.bold)}
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Label.strong};
  transform: rotate(${(props) => (props.$open ? '180deg' : '0deg')});
  transition: transform 0.15s ease;
`;

const GroupCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.tertiary};
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ItemName = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SubmittedAt = styled.p`
  margin: 0;
  white-space: nowrap;
  color: ${Label.assistive};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const DueDate = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;
