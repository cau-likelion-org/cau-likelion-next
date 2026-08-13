import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const RoadmapSection = ({
  imageName,
  onChange,
  disabled = false,
}: {
  imageName: string;
  onChange: (imageName: string) => void;
  disabled?: boolean;
}) => {
  return (
    <Section>
      <Title>활동 로드맵</Title>
      <TextField
        heading="이미지 첨부"
        value={imageName}
        placeholder="이미지 파일을 선택해 주세요."
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </Section>
  );
};

export default RoadmapSection;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;
