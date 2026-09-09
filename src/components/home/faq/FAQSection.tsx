import { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { IcChevronDown } from '@assets/svg';
import { getFaqs } from 'src/apis/faq';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { Black, BackgroundWhite, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { MOBILE } from '@home/common/responsive';

const FAQSection = () => {
  const { data: faqs, isLoading, isError } = useQuery({ queryKey: ['faqs'], queryFn: () => getFaqs() });
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggle = (id: number) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]));
  };

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
        <List>
          {faqs?.map(({ id, question, answer }) => {
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

  @media (max-width: ${MOBILE}px) {
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

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;
