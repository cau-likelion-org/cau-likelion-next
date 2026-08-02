import { Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import styled from 'styled-components';

const ProjectPageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Wrapper>
  );
};

export default ProjectPageHeader;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 1060px;
  max-width: 100%;
  padding: 80px 0 52px;
  color: ${Orange.o500};

  @media (max-width: 900px) {
    padding: 48px 0 32px;
  }
`;

const Title = styled.h1`
  margin: 0;
  ${typographyCss(Typography.display2.bold)}

  @media (max-width: 900px) {
    ${typographyCss(Typography.title2.bold)}
  }
`;

const Subtitle = styled.p`
  margin: 0;
  ${typographyCss(Typography.heading2.medium)}
`;
