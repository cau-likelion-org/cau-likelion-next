import { useState } from 'react';
import styled from 'styled-components';
import { IcChevronDown } from '@assets/svg';
import { Black, BackgroundWhite, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface IFaq {
  question: string;
  answer: string;
}

const QUESTION = 'Q. 질문 내용 질문 내용 질문 내용 질문 내용 질문 내용 질문 내용';
const ANSWER =
  '답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용';

const FAQS: IFaq[] = [
  { question: QUESTION, answer: ANSWER },
  { question: QUESTION, answer: ANSWER },
  { question: QUESTION, answer: ANSWER },
  { question: QUESTION, answer: ANSWER },
];

const DEFAULT_OPEN_INDEXES = [0, 2];

const FAQSection = () => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(DEFAULT_OPEN_INDEXES);

  const toggle = (index: number) => {
    setOpenIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <Wrapper>
      <Title>FAQ</Title>
      <List>
        {FAQS.map(({ question, answer }, index) => {
          const isOpen = openIndexes.includes(index);
          return (
            <Item key={index} type="button" $open={isOpen} aria-expanded={isOpen} onClick={() => toggle(index)}>
              <TextGroup>
                <Question>{question}</Question>
                {isOpen && <Answer>{answer}</Answer>}
              </TextGroup>
              <ChevronIcon $open={isOpen} />
            </Item>
          );
        })}
      </List>
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
`;

const Title = styled.p`
  ${typographyCss(Typography.display2.bold)}
  color: ${Black.b900};
  margin: 0;
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
  transform: rotate(${(props) => (props.$open ? '180deg' : '0deg')});
`;
