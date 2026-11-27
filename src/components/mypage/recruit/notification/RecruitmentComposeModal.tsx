import { useRef, useState } from 'react';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { FieldDescription } from '@common/fieldStatus/FieldStatus';
import Textarea from '@common/textarea/Textarea';
import Button from '@common/button/Button';
import DateTimeInput from '@common/dateTimeInput/DateTimeInput';
import { isUnfilled } from '@utils/validation';
import { Label, Line, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import useRequiredFieldsSave from 'src/hooks/useRequiredFieldsSave';
import SendTargetChipList from './SendTargetChipList';
import EmailModalLayout, { Field, LargeHeading, LargeRequired } from './EmailModalLayout';

export interface RecruitmentComposeForm {
  title: string;
  content: string;
  scheduledSendAt?: string;
}

interface RecruitmentComposeRecipient {
  id: number;
  email: string;
}

interface RecruitmentComposeModalProps {
  recipients: RecruitmentComposeRecipient[];
  onRemoveRecipient: (id: number) => void;
  onClose: () => void;
  onSubmit: (form: RecruitmentComposeForm) => void | Promise<unknown>;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
  initialValues?: { title: string; content: string; scheduledSendAt: string | null };
  submitLabel?: string;
  cancelSend?: { onConfirm: () => void; isSubmitting?: boolean };
}

// 날짜와 시각 중 먼저 비어 있는 칸 아래에 한 번만 표시한다
const SCHEDULE_ERROR_MESSAGE = '발송 날짜와 시각을 선택해 주세요.';

const RecruitmentComposeModal = ({
  recipients,
  onRemoveRecipient,
  onClose,
  onSubmit,
  isSubmitting = false,
  mode = 'create',
  initialValues,
  submitLabel = '발송 예약하기',
  cancelSend,
}: RecruitmentComposeModalProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [date, setDate] = useState(initialValues?.scheduledSendAt ? initialValues.scheduledSendAt.slice(0, 10) : '');
  const [time, setTime] = useState(initialValues?.scheduledSendAt ? initialValues.scheduledSendAt.slice(11, 16) : '');
  const [pendingCancelAction, setPendingCancelAction] = useState<(() => void) | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { showErrors, validate } = useRequiredFieldsSave(modalRef);

  const isScheduleInvalid = !date || !time;
  const isInvalid = recipients.length === 0 || isUnfilled(title) || isUnfilled(content) || isScheduleInvalid;

  const handleSubmit = () => {
    if (!validate(isInvalid)) return;
    onSubmit({
      title,
      content,
      scheduledSendAt: `${date}T${time}:00`,
    });
  };

  return (
    <EmailModalLayout
      ariaLabel="메일 작성"
      onClose={onClose}
      modalRef={modalRef}
      actions={
        <Actions>
          {pendingCancelAction ? (
            <ConfirmBox>
              <ConfirmText>정말 취소하시겠습니까?</ConfirmText>
              <ConfirmActions>
                <ConfirmTextButton type="button" onClick={() => setPendingCancelAction(null)}>
                  아니요
                </ConfirmTextButton>
                <ConfirmTextButton
                  type="button"
                  $tone="negative"
                  onClick={() => {
                    pendingCancelAction();
                    setPendingCancelAction(null);
                  }}
                >
                  발송 취소
                </ConfirmTextButton>
              </ConfirmActions>
            </ConfirmBox>
          ) : (
            mode === 'edit' &&
            cancelSend && (
              <CancelSendButton
                size="large"
                color="assistive"
                onClick={() => setPendingCancelAction(() => cancelSend.onConfirm)}
                disabled={cancelSend.isSubmitting}
              >
                발송 취소
              </CancelSendButton>
            )
          )}
          <ButtonGroup>
            <Button
              variant="outlined"
              color="assistive"
              size="large"
              onClick={mode === 'create' ? () => setPendingCancelAction(() => onClose) : onClose}
              disabled={isSubmitting}
            >
              닫기
            </Button>
            <Button size="large" onClick={handleSubmit} loading={isSubmitting}>
              {submitLabel}
            </Button>
          </ButtonGroup>
        </Actions>
      }
    >
      <Field>
        <LargeHeading>
          발송 대상<LargeRequired>*</LargeRequired>
        </LargeHeading>
        <RecipientBox
          $status={showErrors && recipients.length === 0 ? 'negative' : 'normal'}
          tabIndex={-1}
          aria-invalid={showErrors && recipients.length === 0}
        >
          <SendTargetChipList
            chips={recipients.map((recipient) => ({
              key: String(recipient.id),
              label: recipient.email,
              onRemove: () => onRemoveRecipient(recipient.id),
            }))}
          />
        </RecipientBox>
        {showErrors && recipients.length === 0 && (
          <FieldDescription $status="negative">발송 대상을 선택해 주세요.</FieldDescription>
        )}
      </Field>

      <Field>
        <LargeHeading>
          제목<LargeRequired>*</LargeRequired>
        </LargeHeading>
        <TextField
          value={title}
          placeholder="메시지를 입력해 주세요."
          onChange={(event) => setTitle(event.target.value)}
          status={showErrors && isUnfilled(title) ? 'negative' : 'normal'}
          description={showErrors && isUnfilled(title) ? '제목을 입력해 주세요.' : undefined}
        />
      </Field>

      <Field>
        <LargeHeading>
          내용<LargeRequired>*</LargeRequired>
        </LargeHeading>
        <ContentTextarea
          value={content}
          placeholder="메세지를 입력해 주세요."
          onChange={(event) => setContent(event.target.value)}
          status={showErrors && isUnfilled(content) ? 'negative' : 'normal'}
          description={showErrors && isUnfilled(content) ? '내용을 입력해 주세요.' : undefined}
        />
      </Field>

      <Field>
        <Heading>
          발송 예약<Required>*</Required>
        </Heading>
        <DateRow>
          <DateTimeInput
            aria-label="발송 날짜"
            value={date}
            onChange={setDate}
            status={showErrors && !date ? 'negative' : 'normal'}
            description={showErrors && !date ? SCHEDULE_ERROR_MESSAGE : undefined}
          />
          <DateTimeInput
            type="time"
            aria-label="발송 시간"
            value={time}
            onChange={setTime}
            status={showErrors && !time ? 'negative' : 'normal'}
            description={showErrors && date && !time ? SCHEDULE_ERROR_MESSAGE : undefined}
          />
        </DateRow>
      </Field>
    </EmailModalLayout>
  );
};

export default RecruitmentComposeModal;

const Heading = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const Required = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const RecipientBox = styled.div<{ $status: 'normal' | 'negative' }>`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: ${(props) =>
    props.$status === 'negative'
      ? 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)'
      : `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`};
`;

const DateRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 28px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const CancelSendButton = styled(Button)`
  margin-right: auto;
`;

const ConfirmBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  height: 48px;
  padding: 0 12px;
  margin-right: auto;
  border: 1px solid ${Line.normal};
  border-radius: 12px;
  box-sizing: border-box;
`;

const ConfirmText = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const ConfirmActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const ConfirmTextButton = styled.button<{ $tone?: 'negative' }>`
  border: none;
  background: none;
  padding: 4px 0;
  color: ${(props) => (props.$tone === 'negative' ? Orange.o500 : Label.alternative)};
  cursor: pointer;
  ${typographyCss(Typography.label1Normal.bold)}
`;

const ContentTextarea = styled(Textarea)`
  textarea {
    min-height: 126px;
  }
`;
