import styled from 'styled-components';

import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import CharCount from '@common/charCount/CharCount';
import AddCardButton from '@mypage/admin/component/AddCardButton';
import RemoveCardButton from '@mypage/admin/component/RemoveCardButton';
import { isUnfilled } from '@utils/index';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { createId } from './utils';

export interface TalentItem {
  id: string;
  partName: string;
  content: string;
}

export const isTalentItemInvalid = (item: TalentItem) => isUnfilled(item.partName) || isUnfilled(item.content);

export const isTalentItemsInvalid = (items: TalentItem[]) => items.length === 0 || items.some(isTalentItemInvalid);

const createEmptyItem = (): TalentItem => ({ id: createId(), partName: '', content: '' });

const TalentSection = ({
  items,
  onChange,
  showErrors,
  disabled = false,
}: {
  items: TalentItem[];
  onChange: (items: TalentItem[]) => void;
  showErrors: boolean;
  disabled?: boolean;
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
              disabled={disabled}
              onChange={(event) => updateItem(item.id, { partName: event.target.value })}
              status={showErrors && isUnfilled(item.partName) ? 'negative' : 'normal'}
              description={showErrors && isUnfilled(item.partName) ? '파트명을 입력해 주세요.' : undefined}
            />
          </FieldWrapper>
          <Textarea
            heading="인재상"
            value={item.content}
            placeholder="텍스트 입력"
            maxLength={1000}
            disabled={disabled}
            bottomTrailingContent={<CharCount>{item.content.length}/1000</CharCount>}
            onChange={(event) => updateItem(item.id, { content: event.target.value })}
            status={showErrors && isUnfilled(item.content) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(item.content) ? '인재상을 입력해 주세요.' : undefined}
          />
          {!disabled && (
            <ButtonRow>
              <RemoveCardButton onClick={() => removeItem(item.id)} />
            </ButtonRow>
          )}
        </Card>
      ))}
      {!disabled && <AddCardButton onClick={addItem} ariaLabel="인재상 추가" />}
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
