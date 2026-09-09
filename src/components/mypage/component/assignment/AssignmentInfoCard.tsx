import styled from 'styled-components';

import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const formatDeadline = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
};

interface AssignmentInfoCardProps {
  title: string;
  detail?: string;
  endDate: string;
}

// 과제 상세 정보 카드 (Figma 8.4.7 Frame 1220)
const AssignmentInfoCard = ({ title, detail, endDate }: AssignmentInfoCardProps) => {
  return (
    <Card>
      <Title>{title}</Title>
      {detail && <Detail>{detail}</Detail>}
      <Deadline>
        마감일 <Bar>ㅣ</Bar> {formatDeadline(endDate)}
      </Deadline>
    </Card>
  );
};

export default AssignmentInfoCard;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 32px;
  border: 1px solid ${Line.subtle};
  border-radius: 22px;
  background-color: ${BackgroundWhite.secondary};
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.title2.bold)}
`;

const Detail = styled.p`
  margin: 0;
  color: #121212;
  ${typographyCss(Typography.heading2.medium)}
`;

const Deadline = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const Bar = styled.span`
  color: ${Label.alternative};
`;
