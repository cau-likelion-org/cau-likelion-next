import styled from 'styled-components';

import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import CharCount from '@common/charCount/CharCount';
import AddCardButton from '@mypage/component/AddCardButton';
import RemoveCardButton from '@mypage/component/RemoveCardButton';
import { createId } from '@mypage/admin/utils';
import { IcHandleDesktop } from '@assets/svg';
import useDragReorder from 'src/hooks/useDragReorder';
import useListItems from 'src/hooks/useListItems';
import { isUnfilled } from '@utils/index';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const isFaqItemInvalid = (item: FaqItem) => isUnfilled(item.question) || isUnfilled(item.answer);

const createEmptyItem = (): FaqItem => ({ id: createId(), question: '', answer: '' });

export interface FaqCardListProps {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
  showErrors: boolean;
  disabled?: boolean;
  minItems?: number;
  // 랜딩 관리 FAQ API에는 순서 값이 없어 순서를 저장할 수 있는 곳에서만 켠다
  reorderable?: boolean;
}

const FaqCardList = ({
  items,
  onChange,
  showErrors,
  disabled = false,
  minItems = 0,
  reorderable = false,
}: FaqCardListProps) => {
  const { updateItem, removeItem, addItem } = useListItems(items, onChange, createEmptyItem);
  const canReorder = reorderable && !disabled;
  const drag = useDragReorder(items, onChange, !canReorder);

  return (
    <>
      {items.map((item, index) => (
        <Card key={item.id} {...drag.getItemProps(index)}>
          {canReorder && (
            <Handle {...drag.getHandleProps(index)} aria-hidden>
              <IcHandleDesktop width={24} height={24} />
            </Handle>
          )}
          <Body>
            <TextField
              heading="질문 내용"
              value={item.question}
              placeholder="텍스트 입력"
              readOnly={disabled}
              onChange={(event) => updateItem(item.id, { question: event.target.value })}
              status={showErrors && isUnfilled(item.question) ? 'negative' : 'normal'}
              description={showErrors && isUnfilled(item.question) ? '질문 내용을 입력해 주세요.' : undefined}
            />
            <Textarea
              heading="답변 내용"
              value={item.answer}
              placeholder="텍스트 입력"
              maxLength={1000}
              readOnly={disabled}
              bottomTrailingContent={<CharCount>{item.answer.length}/1000</CharCount>}
              onChange={(event) => updateItem(item.id, { answer: event.target.value })}
              status={showErrors && isUnfilled(item.answer) ? 'negative' : 'normal'}
              description={showErrors && isUnfilled(item.answer) ? '답변 내용을 입력해 주세요.' : undefined}
            />
            {!disabled && (
              <ButtonRow>
                <RemoveCardButton onClick={() => removeItem(item.id)} disabled={items.length <= minItems} />
              </ButtonRow>
            )}
          </Body>
        </Card>
      ))}
      {!disabled && <AddCardButton onClick={addItem} ariaLabel="FAQ 추가" />}
    </>
  );
};

export default FaqCardList;

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px ${Line.subtle};
  background-color: ${BackgroundWhite.secondary};
`;

const Handle = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${Label.normal};
  cursor: grab;
`;

const Body = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
