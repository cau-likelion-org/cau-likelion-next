import { useState } from 'react';
import styled from 'styled-components';

import { IcChevronDownThick, IcChevronUpThick } from '@assets/svg';
import { BackgroundWhite, Black, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface CurriculumWeek {
  key: string;
  badge: string;
  title: string;
  content?: string;
}

export interface WeekAccordionProps {
  weeks: CurriculumWeek[];
}

const WeekAccordion = ({ weeks }: WeekAccordionProps) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const onToggle = (key: string) => {
    setExpandedKeys((prev) => (prev.includes(key) ? prev.filter((prevKey) => prevKey !== key) : [...prev, key]));
  };

  return (
    <List>
      {weeks.map((week) => {
        const expanded = expandedKeys.includes(week.key);
        return (
          <Item key={week.key} expanded={expanded} onClick={() => onToggle(week.key)}>
            <ItemHeader>
              <Badge expanded={expanded}>{week.badge}</Badge>
              <ItemTitle expanded={expanded}>{week.title}</ItemTitle>
              {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </ItemHeader>
            {expanded && week.content && <ItemContent>{week.content}</ItemContent>}
          </Item>
        );
      })}
    </List>
  );
};

export default WeekAccordion;

const List = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Item = styled.button<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
  padding: 20px;
  border: 1px solid ${(props) => (props.expanded ? 'transparent' : Line.subtle)};
  border-radius: 14px;
  background-color: ${(props) => (props.expanded ? Orange.o500 : BackgroundWhite.secondary)};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
`;

const ChevronUpIcon = styled(IcChevronUpThick)`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${Black.b0};
`;

const ChevronDownIcon = styled(IcChevronDownThick)`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${Label.assistive};
`;

const Badge = styled.span<{ expanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px;
  border-radius: 6px;
  background-color: ${Orange.o75};
  color: ${Orange.o500};
  white-space: nowrap;
  ${typographyCss(Typography.caption1.medium)}
`;

const ItemTitle = styled.p<{ expanded: boolean }>`
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  color: ${(props) => (props.expanded ? '#ffffff' : Label.normal)};
  ${typographyCss(Typography.heading1.bold)}
`;

const ItemContent = styled.p`
  margin: 0;
  width: 100%;
  color: #ffffff;
  ${typographyCss(Typography.headline1.medium)}
`;
