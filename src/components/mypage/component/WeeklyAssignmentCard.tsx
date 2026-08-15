import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ContentBadge from '@common/badge/ContentBadge';
import MobileUnsupportedModal from '@common/modal/MobileUnsupportedModal';
import { AssignmentDisplayStatus } from 'src/apis/assignment';
import { IcChevronDown } from '@assets/svg';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface AssignmentItem {
  name: string;
  status: AssignmentDisplayStatus;
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
  status: AssignmentDisplayStatus;
  cards: AssignmentCard[];
}

// 주차 종합 상태 뱃지 — 여러 과제를 합친 상태라 '제출 완료'로 표기한다
const WEEK_BADGE_CONFIG: Record<AssignmentDisplayStatus, { label: string; color: 'neutral' | 'accent' }> = {
  BEFORE_SUBMISSION: { label: '제출 전', color: 'neutral' },
  MISSED: { label: '미제출', color: 'neutral' },
  PENDING_REVIEW: { label: '승인 대기', color: 'neutral' },
  LATE_SUBMITTED: { label: '지각 제출', color: 'neutral' },
  APPROVED: { label: '제출 완료', color: 'accent' },
  REJECTED: { label: '승인 반려', color: 'neutral' },
};

const ITEM_BADGE_CONFIG: Record<AssignmentDisplayStatus, { label: string; color: 'neutral' | 'accent' }> = {
  BEFORE_SUBMISSION: { label: '제출 전', color: 'neutral' },
  MISSED: { label: '미제출', color: 'neutral' },
  PENDING_REVIEW: { label: '승인 대기', color: 'neutral' },
  LATE_SUBMITTED: { label: '지각 제출', color: 'neutral' },
  APPROVED: { label: '승인 완료', color: 'accent' },
  REJECTED: { label: '승인 반려', color: 'neutral' },
};

const WeeklyAssignmentCard = ({ group }: { group: WeeklyAssignmentGroup }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isUnsupportedOpen, setIsUnsupportedOpen] = useState(false);
  const weekBadge = WEEK_BADGE_CONFIG[group.status];

  // 제출·수정은 데스크톱 전용이라 모바일에서는 안내 모달을 띄운다
  const handleAction = (card: AssignmentCard) => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
      setIsUnsupportedOpen(true);
      return;
    }
    if (card.id) router.push(`/mypage/assignment/${card.id}`);
  };

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
              {card.actionLabel && (
                <>
                  <DesktopAction>
                    <Button size="large" onClick={() => handleAction(card)}>
                      {card.actionLabel}
                    </Button>
                  </DesktopAction>
                  <MobileAction>
                    <Button size="small" onClick={() => handleAction(card)}>
                      {card.actionLabel}
                    </Button>
                  </MobileAction>
                </>
              )}
            </FooterRow>
          </GroupCard>
        ))}
      {isUnsupportedOpen && <MobileUnsupportedModal onClose={() => setIsUnsupportedOpen(false)} />}
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

  @media (max-width: 900px) {
    padding: 20px 26px;
  }
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

  @media (max-width: 900px) {
    gap: 8px;
  }
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Label.strong};
  transform: rotate(${(props) => (props.$open ? '180deg' : '0deg')});
  transition: transform 0.15s ease;

  /* Figma 모바일: 꺾쇠 24px */
  @media (max-width: 900px) {
    svg {
      width: 24px;
      height: 24px;
    }
  }
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

  @media (max-width: 900px) {
    padding: 20px 26px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  /* Figma 모바일: 과제 사이 구분선 (위아래 16px) */
  @media (max-width: 900px) {
    align-items: flex-start;
  }

  & + & {
    @media (max-width: 900px) {
      padding-top: 16px;
      border-top: 1px solid ${Line.subtle};
    }
  }
`;

const ItemName = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}

  @media (max-width: 900px) {
    flex: 1 0 0;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #121212;
  }
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  /* Figma 모바일: 뱃지가 위, 제출 시각이 아래 (데스크톱 가로 순서와 반대라 column-reverse) */
  @media (max-width: 900px) {
    flex-direction: column-reverse;
    align-items: flex-end;
    justify-content: center;
    flex-shrink: 0;
    gap: 10px;
  }
`;

const SubmittedAt = styled.p`
  margin: 0;
  white-space: nowrap;
  color: ${Label.assistive};
  ${typographyCss(Typography.body1Reading.regular)}

  @media (max-width: 900px) {
    text-align: right;
    ${typographyCss(Typography.label1Normal.regular)}
  }
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  /* Figma 모바일: 과제 목록과 22px 간격 (컨테이너 gap 16 + 6) */
  @media (max-width: 900px) {
    margin-top: 6px;
  }
`;

const DesktopAction = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

const MobileAction = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: block;
  }
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
