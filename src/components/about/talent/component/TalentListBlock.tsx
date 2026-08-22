import styled from 'styled-components';

import { Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface TalentListBlockProps {
  className?: string;
  title: string;
  items: string[];
}

const TalentListBlock = ({ className, title, items }: TalentListBlockProps) => {
  return (
    <Wrapper className={className}>
      <Title>{title}</Title>
      <Divider />
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
    </Wrapper>
  );
};

export default TalentListBlock;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Orange.o500};
  text-align: center;
  ${typographyCss(Typography.title3.bold)}
`;

const Divider = styled.hr`
  margin: 0;
  width: 100%;
  border: none;
  border-top: 1px solid ${Orange.o500};
`;

const List = styled.ul`
  margin: 0;
  padding-left: 25.5px;
  color: #ffffff;
  list-style: disc;
  ${typographyCss(Typography.headline2.medium)}
`;

const ListItem = styled.li`
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;
