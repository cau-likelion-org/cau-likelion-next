import styled from 'styled-components';

import FAQAccordion from '@common/faqAccordion/FAQAccordion';
import { Black } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitFaq } from './mock';

export interface RecruitFAQSectionProps {
  faqs: RecruitFaq[];
}

const RecruitFAQSection = ({ faqs }: RecruitFAQSectionProps) => {
  return (
    <Wrapper>
      <Content>
        <Title>아기사자 모집 FAQ</Title>
        <FAQAccordion items={faqs.map((faq) => ({ ...faq, question: `Q. ${faq.question}` }))} />
      </Content>
    </Wrapper>
  );
};

export default RecruitFAQSection;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 80px 20px;

  ${media.xs} {
    padding: 60px 20px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
  width: 100%;
  max-width: 1060px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${Black.b900};
  text-align: center;
  ${typographyCss(Typography.display2.bold)}

  ${media.xs} {
    ${typographyCss(Typography.title1.bold)}
  }
`;
