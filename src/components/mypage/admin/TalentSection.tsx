import styled from 'styled-components';

import Button from '@common/button/Button';
import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import CharCount from '@common/charCount/CharCount';
import AddCardButton from '@mypage/admin/component/AddCardButton';
import RemoveCardButton from '@mypage/admin/component/RemoveCardButton';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { createId } from './utils';

export interface TalentItem {
  id: string;
  partName: string;
  content: string;
}

const createEmptyItem = (): TalentItem => ({ id: createId(), partName: '', content: '' });

const TalentSection = ({
  items,
  onChange,
  onSave,
}: {
  items: TalentItem[];
  onChange: (items: TalentItem[]) => void;
  onSave: () => void;
}) => {
  const updateItem = (id: string, patch: Partial<TalentItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => onChange(items.filter((item) => item.id !== id));

  const addItem = () => onChange([...items, createEmptyItem()]);

  return (
    <Section>
      <Title>중앙대학교 멋쟁이사자처럼 인재상</Title>
      {items.map((item) => (
        <Card key={item.id}>
          <FieldWrapper>
            <TextField
              heading="파트명"
              value={item.partName}
              placeholder="텍스트 입력"
              onChange={(event) => updateItem(item.id, { partName: event.target.value })}
            />
          </FieldWrapper>
          <Textarea
            heading="인재상"
            value={item.content}
            placeholder="텍스트 입력"
            maxLength={1000}
            bottomTrailingContent={<CharCount>{item.content.length}/1000</CharCount>}
            onChange={(event) => updateItem(item.id, { content: event.target.value })}
          />
          <ButtonRow>
            <RemoveCardButton onClick={() => removeItem(item.id)} />
          </ButtonRow>
        </Card>
      ))}
      <AddCardButton onClick={addItem} ariaLabel="인재상 추가" />
      <Button size="large" onClick={onSave}>
        저장
      </Button>
    </Section>
  );
};

export default TalentSection;

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

const FieldWrapper = styled.div`
  flex: 0 0 160px;
`;
