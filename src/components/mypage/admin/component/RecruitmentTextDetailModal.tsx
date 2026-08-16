import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { RecruitmentTextResponse } from 'src/apis/recruitment';
import { STATUS_BADGE } from '@mypage/admin/RecruitmentTextSection';
import ContentBadge from '@common/badge/ContentBadge';
import { IcCaretDown, IcCaretUp } from '@assets/svg';
import { BackgroundColor, Fill, Label, Line, Material, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import useFocusTrap from 'src/hooks/useFocusTrap';

const formatDateTime = (value: string | null) =>
  value ? `${value.slice(0, 10).replace(/-/g, '/')} ${value.slice(11, 16)}` : '-';

interface RecruitmentTextDetailModalProps {
  text: RecruitmentTextResponse;
  onClose: () => void;
  onEdit: () => void;
  onResend: () => void;
  isResending?: boolean;
}

const RecruitmentTextDetailModal = ({
  text,
  onClose,
  onEdit,
  onResend,
  isResending = false,
}: RecruitmentTextDetailModalProps) => {
  const badge = STATUS_BADGE[text.status];
  const canResend = text.status === 'SENT' && text.failedCount > 0;

  const [isRecipientListFaded, setIsRecipientListFaded] = useState(false);
  const [isRecipientListExpanded, setIsRecipientListExpanded] = useState(false);
  const recipientChipRowRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);

  useEffect(() => {
    const el = recipientChipRowRef.current;
    if (!el) return;
    const checkFade = () => setIsRecipientListFaded(el.scrollWidth - el.scrollLeft - el.clientWidth > 1);
    checkFade();
    el.addEventListener('scroll', checkFade);
    const observer = new ResizeObserver(checkFade);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', checkFade);
      observer.disconnect();
    };
  }, [text.recipients]);

  return (
    <Overlay>
      <Dimmer onClick={onClose} />
      <Modal ref={modalRef} role="dialog" aria-modal="true" aria-label="발송 메일 보기" tabIndex={-1}>
        <Information>
          <Field>
            <Heading>수신자 리스트</Heading>
            <RecipientBox>
              <RecipientSummaryRow>
                {canResend ? (
                  <ResendButton type="button" $disabled={isResending} onClick={onResend} disabled={isResending}>
                    발송 실패건 재발송
                  </ResendButton>
                ) : (
                  <ResendButton as="span" $disabled>
                    발송 실패건 재발송
                  </ResendButton>
                )}
                <RecipientCountRow
                  type="button"
                  aria-expanded={isRecipientListExpanded}
                  onClick={() => setIsRecipientListExpanded((prev) => !prev)}
                >
                  {text.status === 'SENT' && (
                    <>
                      <CountLabel>발송 완료 {text.successCount}명</CountLabel>
                      <CountLabel $tone="negative">발송 실패 {text.failedCount}명</CountLabel>
                    </>
                  )}
                  <ContentBadge text={`총 ${text.targetCount}명`} size="small" />
                  {isRecipientListExpanded ? (
                    <IcCaretUp width={16} height={16} />
                  ) : (
                    <IcCaretDown width={16} height={16} />
                  )}
                </RecipientCountRow>
              </RecipientSummaryRow>
              <RecipientChipRow
                ref={recipientChipRowRef}
                $expanded={isRecipientListExpanded}
                $faded={isRecipientListFaded}
              >
                {text.recipients.map((recipient, index) => {
                  const isFailed = text.status === 'SENT' && recipient.status === 'FAILED';
                  return (
                    <RecipientChip key={`${recipient.email}-${index}`} $failed={isFailed}>
                      {recipient.email}
                      {isFailed && <FailedIcon>×</FailedIcon>}
                    </RecipientChip>
                  );
                })}
              </RecipientChipRow>
            </RecipientBox>
          </Field>

          <MailTitle>{text.title}</MailTitle>
          <MailContent>{text.content}</MailContent>

          <StatusRow>
            <ContentBadge text={badge.label} color={badge.color} variant={badge.variant} size="medium" />
            <ScheduledAt>
              발송 일시<Divider>ㅣ</Divider>
              {formatDateTime(text.scheduledSendAt)}
            </ScheduledAt>
          </StatusRow>
        </Information>
        <Actions>
          {text.status !== 'SENT' && (
            <ActionTextButton type="button" onClick={onEdit}>
              수정
            </ActionTextButton>
          )}
          <ActionTextButton type="button" $tone="negative" onClick={onClose}>
            닫기
          </ActionTextButton>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default RecruitmentTextDetailModal;

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

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 28px;
  overflow-y: auto;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Heading = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const RecipientBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);
`;

const RecipientSummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 24px;
  width: 100%;
`;

const ResendButton = styled.button<{ $disabled?: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 7px 14px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.$disabled ? '#F4F4F5' : Orange.o500)};
  color: ${(props) => (props.$disabled ? Label.assistive : BackgroundColor)};
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
  ${typographyCss(Typography.label2.bold)}
`;

const RecipientCountRow = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  padding: 0;
  color: ${Label.normal};
  cursor: pointer;
`;

const CountLabel = styled.span<{ $tone?: 'negative' }>`
  padding: 0 4px;
  color: ${(props) => (props.$tone === 'negative' ? Orange.o500 : Label.alternative)};
  opacity: 0.74;
  ${typographyCss({ ...Typography.label2.bold, fontWeight: 500 })}
`;

const RecipientChipRow = styled.div<{ $expanded: boolean; $faded: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;

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

const RecipientChip = styled.span<{ $failed?: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
  padding: 4px 7px;
  border-radius: 6px;
  background-color: ${(props) => (props.$failed ? 'rgba(255, 0, 0, 0.05)' : Fill.subtle)};
  color: ${(props) => (props.$failed ? State.error : Label.alternative)};
  ${typographyCss(Typography.caption1.medium)}
`;

const FailedIcon = styled.span`
  font-size: 12px;
  line-height: 1;
`;

const MailTitle = styled.p`
  margin: 0;
  width: 100%;
  color: ${Label.normal};
  ${typographyCss(Typography.title2.bold)}
`;

const MailContent = styled.p`
  margin: 0;
  width: 100%;
  white-space: pre-wrap;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.medium)}
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  width: 100%;
`;

const ScheduledAt = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const Divider = styled.span`
  color: ${Label.alternative};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 28px 20px;
`;

const ActionTextButton = styled.button<{ $tone?: 'negative' }>`
  border: none;
  background: none;
  padding: 4px 0;
  color: ${(props) => (props.$tone === 'negative' ? Orange.o500 : Label.alternative)};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.bold)}
`;
