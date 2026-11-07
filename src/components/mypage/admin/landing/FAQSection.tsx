import styled from 'styled-components';

import FaqCardList, { FaqItem } from '@mypage/component/FaqCardList';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const FAQSection = ({
  items,
  onChange,
  showErrors,
  disabled = false,
}: {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
  showErrors: boolean;
  disabled?: boolean;
}) => {
  return (
    <Section>
      <Title>FAQ</Title>
      <FaqCardList items={items} onChange={onChange} showErrors={showErrors} disabled={disabled} />
    </Section>
  );
};

export default FAQSection;

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
