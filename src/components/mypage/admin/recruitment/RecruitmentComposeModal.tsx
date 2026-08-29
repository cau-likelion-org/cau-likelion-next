import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import Textarea from '@common/textarea/Textarea';
import Button from '@common/button/Button';
import Chip from '@common/chip/Chip';
import ScrollArea from '@common/scrollArea/ScrollArea';
import { IcCalendar, IcCaretDown, IcCaretUp, IcClock } from '@assets/svg';
import { isUnfilled } from '@utils/index';
import { BackgroundColor, Label, Line, Material, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import useFocusTrap from 'src/hooks/useFocusTrap';
import useScrollToFirstError from 'src/hooks/useScrollToFirstError';

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

const formatDate = (value: string) => (value ? value.slice(0, 10).replace(/-/g, '/') : '');

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
  const [showErrors, setShowErrors] = useState(false);
  const [isRecipientListExpanded, setIsRecipientListExpanded] = useState(false);
  const [isRecipientListFaded, setIsRecipientListFaded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [pendingCancelAction, setPendingCancelAction] = useState<(() => void) | null>(null);
  const recipientChipRowRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);
  const scrollToFirstError = useScrollToFirstError(modalRef);

  useEffect(() => {
    const el = recipientChipRowRef.current;
    if (!el) return;
    const checkOverflow = () => {
      setIsRecipientListFaded(el.scrollWidth - el.scrollLeft - el.clientWidth > 1);
      // 펼쳐진 상태(줄바꿈)에서는 scrollWidth가 오버플로우를 반영하지 않으므로, 접힌 상태에서 잰 값만 반영한다
      if (!isRecipientListExpanded) setHasOverflow(el.scrollWidth - el.clientWidth > 1);
    };
    checkOverflow();
    el.addEventListener('scroll', checkOverflow);
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', checkOverflow);
      observer.disconnect();
    };
  }, [recipients, isRecipientListExpanded]);

  const isScheduleInvalid = !date || !time;
  const isInvalid = recipients.length === 0 || isUnfilled(title) || isUnfilled(content) || isScheduleInvalid;

  const handleSubmit = () => {
    if (isInvalid) {
      setShowErrors(true);
      scrollToFirstError();
      return;
    }
    onSubmit({
      title,
      content,
      scheduledSendAt: `${date}T${time}:00`,
    });
  };

  return (
    <Overlay>
      <Dimmer onClick={onClose} />
      <Modal ref={modalRef} role="dialog" aria-modal="true" aria-label="메일 작성" tabIndex={-1}>
        <InformationScroll>
          <Information>
            <Field>
              <LargeHeading>
                발송 대상<LargeRequired>*</LargeRequired>
              </LargeHeading>
              <RecipientBox
                $status={showErrors && recipients.length === 0 ? 'negative' : 'normal'}
                tabIndex={-1}
                aria-invalid={showErrors && recipients.length === 0}
              >
                <RecipientChipRow
                  ref={recipientChipRowRef}
                  $expanded={isRecipientListExpanded}
                  $faded={isRecipientListFaded}
                >
                  {recipients.map((recipient) => (
                    <RecipientChip
                      key={recipient.id}
                      size="xsmall"
                      trailingIcon={
                        <RemoveButton
                          type="button"
                          aria-label={`${recipient.email} 삭제`}
                          onClick={() => onRemoveRecipient(recipient.id)}
                        >
                          ×
                        </RemoveButton>
                      }
                    >
                      {recipient.email}
                    </RecipientChip>
                  ))}
                </RecipientChipRow>
                {hasOverflow ? (
                  <RecipientCount
                    type="button"
                    aria-expanded={isRecipientListExpanded}
                    onClick={() => setIsRecipientListExpanded((prev) => !prev)}
                  >
                    <CountText>총 {recipients.length}명</CountText>
                    {isRecipientListExpanded ? (
                      <IcCaretUp width={16} height={16} />
                    ) : (
                      <IcCaretDown width={16} height={16} />
                    )}
                  </RecipientCount>
                ) : (
                  <RecipientCount as="span">
                    <CountText>총 {recipients.length}명</CountText>
                  </RecipientCount>
                )}
              </RecipientBox>
              {showErrors && recipients.length === 0 && <FieldDescription>발송 대상을 선택해 주세요.</FieldDescription>}
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
              <Textarea
                value={content}
                rows={7}
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
                <DateBox $status={showErrors && !date ? 'negative' : 'normal'}>
                  <DateIcon>
                    <IcCalendar width={22} height={22} />
                  </DateIcon>
                  <DateText $filled={!!date}>{date ? formatDate(date) : '캘린더 선택'}</DateText>
                  <HiddenDateInput
                    type="date"
                    aria-label="발송 날짜"
                    aria-invalid={showErrors && !date}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                  />
                </DateBox>
                <DateBox $status={showErrors && !time ? 'negative' : 'normal'}>
                  <DateIcon>
                    <IcClock width={22} height={22} />
                  </DateIcon>
                  <DateText $filled={!!time}>{time || '시간 선택'}</DateText>
                  <HiddenDateInput
                    type="time"
                    aria-label="발송 시간"
                    aria-invalid={showErrors && !time}
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                  />
                </DateBox>
              </DateRow>
              {showErrors && isScheduleInvalid && (
                <FieldDescription>발송 날짜와 시각을 선택해 주세요.</FieldDescription>
              )}
            </Field>
          </Information>
        </InformationScroll>
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
      </Modal>
    </Overlay>
  );
};

export default RecruitmentComposeModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 10000;
`;

const Dimmer = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${Material.dimmer};
  opacity: 0.43;
`;

const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1040px;
  max-height: 90vh;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${BackgroundColor};
`;

const InformationScroll = styled(ScrollArea)`
  flex: 1 1 auto;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 28px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const LargeHeading = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.title3.bold)}
`;

const LargeRequired = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.title3.bold)}
`;

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

const FieldDescription = styled.p`
  margin: 0;
  width: 100%;
  color: ${State.error};
  ${typographyCss(Typography.caption1.regular)}
`;

const RecipientCount = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  height: 24px;
  border: none;
  background: none;
  padding: 0;
  color: ${Label.normal};
  cursor: pointer;
`;

const CountText = styled.span`
  color: ${Label.alternative};
  opacity: 0.74;
  ${typographyCss({ ...Typography.label2.bold, fontWeight: 500 })}
`;

const RecipientChipRow = styled.div<{ $expanded: boolean; $faded: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1 0 0;
  min-width: 0;
  min-height: 24px;

  ${(props) =>
    props.$expanded
      ? `
    flex-wrap: wrap;
  `
      : `
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    ${
      props.$faded
        ? `
      mask-image: linear-gradient(to right, black calc(100% - 32px), transparent 100%);
      -webkit-mask-image: linear-gradient(to right, black calc(100% - 32px), transparent 100%);
    `
        : ''
    }
  `}
`;

const RecipientChip = styled(Chip)`
  flex-shrink: 0;
`;

const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  font-size: 12px;
  line-height: 1;
  color: inherit;
  cursor: pointer;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const DateBox = styled.div<{ $status: 'normal' | 'negative' }>`
  position: relative;
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: ${(props) =>
    props.$status === 'negative'
      ? 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)'
      : `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`};

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const DateIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${Label.alternative};
`;

const DateText = styled.span<{ $filled?: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => (props.$filled ? Label.normal : Label.assistive)};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const HiddenDateInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  cursor: pointer;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 28px 20px;
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
