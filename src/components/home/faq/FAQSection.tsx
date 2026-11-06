import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getFaqs } from 'src/apis/faq';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import FAQAccordion from '@common/faqAccordion/FAQAccordion';
import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { MOBILE } from '@home/common/responsive';

const FAQSection = () => {
  const { data: faqs, isLoading, isError } = useQuery({ queryKey: ['faqs'], queryFn: () => getFaqs() });

  return (
    <Wrapper>
      <Title>FAQ</Title>
      {isLoading ? (
        <LoadingWrapper>
          <LinearLoading />
        </LoadingWrapper>
      ) : isError ? (
        <EmptyState variant="error" />
      ) : (
        <FAQAccordion items={faqs ?? []} />
      )}
    </Wrapper>
  );
};

export default FAQSection;

const Wrapper = styled.div`
  width: 1060px;
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
  scroll-snap-align: start;

  @media (max-width: ${MOBILE}px) {
    width: 100%;
    padding: 60px 20px;
  }
`;

const Title = styled.p`
  ${typographyCss(Typography.display2.bold)}
  color: ${Black.b900};
  margin: 0;

  @media (max-width: ${MOBILE}px) {
    ${typographyCss(Typography.title1.bold)}
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;
