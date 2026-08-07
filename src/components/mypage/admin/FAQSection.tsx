import styled from 'styled-components';

import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import AddCardButton from '@mypage/admin/component/AddCardButton';
import RemoveCardButton from '@mypage/admin/component/RemoveCardButton';
import CharCount from '@mypage/admin/component/CharCount';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { createId } from './utils';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const createEmptyItem = (): FaqItem => ({ id: createId(), question: '', answer: '' });

const FAQSection = ({ items, onChange }: { items: FaqItem[]; onChange: (items: FaqItem[]) => void }) => {
  const updateItem = (id: string, patch: Partial<FaqItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => onChange(items.filter((item) => item.id !== id));

  const addItem = () => onChange([...items, createEmptyItem()]);

  return (
    <Section>
      <Title>FAQ</Title>
      {items.map((item) => (
        <Card key={item.id}>
          <TextField
            heading="질문 내용"
            value={item.question}
            placeholder="텍스트 입력"
            onChange={(event) => updateItem(item.id, { question: event.target.value })}
          />
          <Textarea
            heading="답변 내용"
            value={item.answer}
            placeholder="텍스트 입력"
            maxLength={1000}
            bottomTrailingContent={<CharCount>{item.answer.length}/1000</CharCount>}
            onChange={(event) => updateItem(item.id, { answer: event.target.value })}
          />
          <ButtonRow>
            <RemoveCardButton onClick={() => removeItem(item.id)} />
          </ButtonRow>
        </Card>
      ))}
      <AddCardButton onClick={addItem} ariaLabel="FAQ 추가" />
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

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
