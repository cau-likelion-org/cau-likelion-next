import { HTMLAttributes } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Switch from '@common/switch/Switch';
import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import RemoveCardButton from '@mypage/component/RemoveCardButton';
import { createId } from '@mypage/admin/utils';
import { IcCircleClose, IcHandleDesktop, IcPlus } from '@assets/svg';
import useDragReorder from 'src/hooks/useDragReorder';
import { BackgroundWhite, Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitQuestion, RecruitQuestionType } from './mock';
import QuestionTypeSelect from './QuestionTypeSelect';

const CHOICE_TYPES: RecruitQuestionType[] = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'];

export const isChoiceType = (type: RecruitQuestionType | null) => !!type && CHOICE_TYPES.includes(type);

const toPositiveDigits = (value: string) => value.replace(/\D/g, '').replace(/^0+/, '');

export interface QuestionCardProps {
  index: number;
  question: RecruitQuestion;
  readOnly: boolean;
  onChange: (patch: Partial<RecruitQuestion>) => void;
  onRemove: () => void;
  dragHandleProps: HTMLAttributes<HTMLElement>;
  dragItemProps: HTMLAttributes<HTMLElement> & { draggable: boolean };
}

const QuestionCard = ({
  index,
  question,
  readOnly,
  onChange,
  onRemove,
  dragHandleProps,
  dragItemProps,
}: QuestionCardProps) => {
  const choiceDrag = useDragReorder(question.choices, (choices) => onChange({ choices }), readOnly);

  const changeType = (type: RecruitQuestionType) => {
    onChange({
      type,
      choices: isChoiceType(type) && question.choices.length === 0 ? [{ id: createId(), text: '' }] : question.choices,
    });
  };

  const updateChoice = (id: string, text: string) => {
    onChange({ choices: question.choices.map((choice) => (choice.id === id ? { ...choice, text } : choice)) });
  };

  return (
    <Card {...dragItemProps}>
      <Header {...dragHandleProps} $draggable={!readOnly}>
        <CardTitle>문항 {index + 1}</CardTitle>
        <RequiredRow>
          <FieldLabel>필수</FieldLabel>
          <Switch
            aria-label={`문항 ${index + 1} 필수 여부`}
            checked={question.isRequired}
            disabled={readOnly}
            onChange={(isRequired) => onChange({ isRequired })}
          />
        </RequiredRow>
      </Header>
      <QuestionTypeSelect value={question.type} readOnly={readOnly} onChange={changeType} />
      {question.type && (
        <>
          <TextField
            heading="질문"
            required
            placeholder="질문을 입력해주세요."
            value={question.title}
            readOnly={readOnly}
            onChange={(event) => onChange({ title: event.target.value })}
          />
          <Textarea
            heading="설명글"
            placeholder="문항 설명 텍스트 입력 (선택)"
            value={question.description}
            readOnly={readOnly}
            bottomTrailingContent={<BottomSpacer aria-hidden />}
            onChange={(event) => onChange({ description: event.target.value })}
          />
          {question.type === 'LONG_TEXT' && (
            <TextField
              heading="글자 수 제한 (공백 포함)"
              inputMode="numeric"
              placeholder="숫자로 입력해주세요."
              value={question.maxLength}
              readOnly={readOnly}
              onChange={(event) => onChange({ maxLength: toPositiveDigits(event.target.value) })}
              trailingContent={<Unit>자</Unit>}
            />
          )}
          {isChoiceType(question.type) && (
            <>
              <ChoiceGroup>
                <FieldLabel>선택지 문항</FieldLabel>
                {question.choices.map((choice, choiceIndex) => (
                  <div key={choice.id} {...choiceDrag.getItemProps(choiceIndex)}>
                    <TextField
                      aria-label={`선택지 ${choiceIndex + 1}`}
                      placeholder="문항 텍스트를 입력해주세요."
                      value={choice.text}
                      readOnly={readOnly}
                      onChange={(event) => updateChoice(choice.id, event.target.value)}
                      leadingIcon={
                        !readOnly && (
                          <Handle {...choiceDrag.getHandleProps(choiceIndex)} aria-hidden>
                            <IcHandleDesktop width={22} height={22} />
                          </Handle>
                        )
                      }
                      trailingContent={
                        !readOnly && (
                          <ClearButton
                            type="button"
                            aria-label={`선택지 ${choiceIndex + 1} 삭제`}
                            onClick={() =>
                              onChange({ choices: question.choices.filter((item) => item.id !== choice.id) })
                            }
                          >
                            <IcCircleClose width={22} height={22} />
                          </ClearButton>
                        )
                      }
                    />
                  </div>
                ))}
              </ChoiceGroup>
              {!readOnly && (
                <AddChoiceButton
                  size="small"
                  color="assistive"
                  trailingIcon={<IcPlus width={16} height={16} />}
                  onClick={() => onChange({ choices: [...question.choices, { id: createId(), text: '' }] })}
                >
                  선택지 추가
                </AddChoiceButton>
              )}
            </>
          )}
        </>
      )}
      {!readOnly && (
        <ButtonRow>
          <RemoveCardButton onClick={onRemove} />
        </ButtonRow>
      )}
    </Card>
  );
};

export default QuestionCard;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px ${Line.subtle};
  background-color: ${BackgroundWhite.secondary};
`;

// 문항 카드에는 별도 핸들이 없어 상단 제목 줄을 드래그 핸들로 쓴다
const Header = styled.div<{ $draggable: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  cursor: ${(props) => (props.$draggable ? 'grab' : 'default')};
`;

const CardTitle = styled.h3`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.heading2.bold)}
`;

const RequiredRow = styled.div`
  display: flex;
  flex: 1 0 0;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
`;

const FieldLabel = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const Unit = styled.span`
  flex-shrink: 0;
  padding: 0 4px;
  color: ${Label.assistive};
  ${typographyCss(Typography.body1Normal.medium)}
`;

// Figma 설명글 칸은 하단 영역(24px)이 비어 있는 상태로 높이를 잡는다
const BottomSpacer = styled.span`
  display: block;
  height: 24px;
`;

const ChoiceGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Handle = styled.span`
  display: flex;
  color: ${Label.normal};
  cursor: grab;
`;

const ClearButton = styled.button`
  display: flex;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.alternative};
  cursor: pointer;
`;

const AddChoiceButton = styled(Button)`
  align-self: flex-start;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
