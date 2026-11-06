import { useState } from 'react';
import styled from 'styled-components';

import { IcChevronDown } from '@assets/svg';
import { BackgroundWhite, Black, Label, Line, Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  className?: string;
  items: FAQItem[];
}

const FAQAccordion = ({ className, items }: FAQAccordionProps) => {
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggle = (id: number) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]));
  };

  return (
    <List className={className}>
      {items.map(({ id, question, answer }) => {
        const isOpen = openIds.includes(id);
        return (
          <Item key={id} type="button" $open={isOpen} aria-expanded={isOpen} onClick={() => toggle(id)}>
            <TextGroup>
              <Question>{question}</Question>
              {isOpen && <Answer>{answer}</Answer>}
            </TextGroup>
            <ChevronIcon $open={isOpen} />
          </Item>
        );
      })}
    </List>
  );
};

export default FAQAccordion;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
`;

const Item = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 32px;
  border-radius: 14px;
  background-color: ${(props) => (props.$open ? Orange.o50 : BackgroundWhite.secondary)};
  box-shadow: inset 0 0 0 1px ${(props) => (props.$open ? Orange.o500 : Line.subtle)};
  border: none;
  cursor: pointer;
  text-align: left;

  ${media.xs} {
    gap: 14px;
    padding: 18px;
  }
`;

const TextGroup = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
`;

const Question = styled.p`
  ${typographyCss(Typography.heading1.bold)}
  color: ${Black.b900};
  margin: 0;
`;

const Answer = styled.p`
  ${typographyCss(Typography.headline1.medium)}
  color: ${Black.b900};
  width: 100%;
  margin: 0;
`;

const ChevronIcon = styled(IcChevronDown)<{ $open: boolean }>`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${Label.normal};
  transform: rotate(${(props) => (props.$open ? '180deg' : '0deg')});
`;
