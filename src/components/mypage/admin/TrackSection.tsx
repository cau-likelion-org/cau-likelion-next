import styled from 'styled-components';

import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import AddCardButton from '@mypage/admin/component/AddCardButton';
import RemoveCardButton from '@mypage/admin/component/RemoveCardButton';
import CharCount from '@common/charCount/CharCount';
import TechStackInput from '@mypage/admin/component/TechStackInput';
import { isUnfilled } from '@utils/index';
import { BackgroundWhite, Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { createId } from './utils';

export interface TrackIntroItem {
  id: string;
  nameKo: string;
  nameEn: string;
  description: string;
  techStack: string[];
}

export const isTrackItemInvalid = (item: TrackIntroItem) =>
  isUnfilled(item.nameKo) || isUnfilled(item.nameEn) || isUnfilled(item.description) || item.techStack.length === 0;

const createEmptyItem = (): TrackIntroItem => ({
  id: createId(),
  nameKo: '',
  nameEn: '',
  description: '',
  techStack: [],
});

const TrackSection = ({
  items,
  onChange,
  showErrors,
  disabled = false,
}: {
  items: TrackIntroItem[];
  onChange: (items: TrackIntroItem[]) => void;
  showErrors: boolean;
  disabled?: boolean;
}) => {
  const updateItem = (id: string, patch: Partial<TrackIntroItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => onChange(items.filter((item) => item.id !== id));

  const addItem = () => onChange([...items, createEmptyItem()]);

  return (
    <Section>
      <Title>14기 트랙 소개</Title>
      {items.map((item) => (
        <Card key={item.id}>
          <Row>
            <NameFieldWrapper>
              <TextField
                heading="파트명"
                value={item.nameKo}
                placeholder="텍스트 입력"
                readOnly={disabled}
                onChange={(event) => updateItem(item.id, { nameKo: event.target.value })}
                status={showErrors && isUnfilled(item.nameKo) ? 'negative' : 'normal'}
                description={showErrors && isUnfilled(item.nameKo) ? '파트명을 입력해 주세요.' : undefined}
              />
            </NameFieldWrapper>
            <EnglishNameFieldWrapper>
              <TextField
                heading="파트 영문명"
                value={item.nameEn}
                placeholder="텍스트 입력"
                readOnly={disabled}
                onChange={(event) => updateItem(item.id, { nameEn: event.target.value })}
                status={showErrors && isUnfilled(item.nameEn) ? 'negative' : 'normal'}
                description={showErrors && isUnfilled(item.nameEn) ? '파트 영문명을 입력해 주세요.' : undefined}
              />
            </EnglishNameFieldWrapper>
          </Row>
          <Textarea
            heading="파트소개"
            value={item.description}
            placeholder="리스트 입력"
            maxLength={1000}
            readOnly={disabled}
            bottomTrailingContent={<CharCount>{item.description.length}/1000</CharCount>}
            onChange={(event) => updateItem(item.id, { description: event.target.value })}
            status={showErrors && isUnfilled(item.description) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(item.description) ? '파트소개를 입력해 주세요.' : undefined}
          />
          <StackRow>
            <StackField>
              <FieldLabel>기술 스택</FieldLabel>
              <TechStackInput
                value={item.techStack}
                onChange={(techStack) => updateItem(item.id, { techStack })}
                disabled={disabled}
              />
              {showErrors && item.techStack.length === 0 && <ErrorText>기술 스택을 입력해 주세요.</ErrorText>}
            </StackField>
            {!disabled && <RemoveCardButton onClick={() => removeItem(item.id)} />}
          </StackRow>
        </Card>
      ))}
      {!disabled && <AddCardButton onClick={addItem} ariaLabel="트랙 소개 추가" />}
    </Section>
  );
};

export default TrackSection;

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

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
`;

const NameFieldWrapper = styled.div`
  flex: 0 0 160px;
`;

const EnglishNameFieldWrapper = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

const StackRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 20px;
  width: 100%;
`;

const StackField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 0 0;
  min-width: 0;
`;

const FieldLabel = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${State.error};
  ${typographyCss(Typography.caption1.regular)}
`;
