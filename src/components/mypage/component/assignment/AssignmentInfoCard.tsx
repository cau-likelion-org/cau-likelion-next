import styled from 'styled-components';

import { formatDueDate } from 'src/apis/assignment';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

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
        마감일 <Bar>ㅣ</Bar> {formatDueDate(endDate)}
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
  white-space: pre-line;
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
