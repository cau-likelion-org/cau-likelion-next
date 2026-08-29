import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Chip from '@common/chip/Chip';
import ScrollArea from '@common/scrollArea/ScrollArea';
import LinkifiedText from './LinkifiedText';
import { IcCaretDown, IcCaretUp } from '@assets/svg';
import { BackgroundColor, Fill, Label, Line, Material, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import useFocusTrap from 'src/hooks/useFocusTrap';

interface RecruitmentResendModalProps {
  title: string;
  content: string;
  recipients: string[];
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const RecruitmentResendModal = ({
  title,
  content,
  recipients,
  onClose,
  onConfirm,
  isSubmitting = false,
}: RecruitmentResendModalProps) => {
  const [isRecipientListExpanded, setIsRecipientListExpanded] = useState(false);
  const [isRecipientListFaded, setIsRecipientListFaded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const recipientChipRowRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);

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

  return (
    <Overlay>
      <Dimmer onClick={onClose} />
      <Modal ref={modalRef} role="dialog" aria-modal="true" aria-label="실패건 즉시 재발송" tabIndex={-1}>
        <InformationScroll>
          <Information>
            <Field>
              <LargeHeading>
                발송 대상<LargeRequired>*</LargeRequired>
              </LargeHeading>
              <RecipientBox>
                <RecipientSummaryRow>
                  <RecipientChipRow
                    ref={recipientChipRowRef}
                    $expanded={isRecipientListExpanded}
                    $faded={isRecipientListFaded}
                  >
                    {recipients.map((email, index) => (
                      <RecipientChip key={`${email}-${index}`} size="xsmall">
                        {email}
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
                </RecipientSummaryRow>
              </RecipientBox>
            </Field>

            <Field>
              <LargeHeading>제목</LargeHeading>
              <ReadonlyBox>{title}</ReadonlyBox>
            </Field>

            <Field>
              <LargeHeading>내용</LargeHeading>
              <ReadonlyTextarea>
                <LinkifiedText text={content} />
              </ReadonlyTextarea>
            </Field>
          </Information>
        </InformationScroll>
        <Actions>
          <Button variant="outlined" color="assistive" size="large" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button size="large" onClick={onConfirm} loading={isSubmitting} disabled={recipients.length === 0}>
            즉시 발송하기
          </Button>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default RecruitmentResendModal;

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

const RecipientBox = styled.div`
  display: flex;
  flex-direction: column;
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
  gap: 20px;
  min-height: 24px;
  width: 100%;
`;

const RecipientChipRow = styled.div<{ $expanded: boolean; $faded: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1 0 0;
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

const RecipientChip = styled(Chip)`
  flex-shrink: 0;
`;

const RecipientCount = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
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

const ReadonlyBox = styled.p`
  margin: 0;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: ${Fill.subtle};
  box-shadow: inset 0 0 0 1px ${Line.normal};
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const ReadonlyTextarea = styled.p`
  margin: 0;
  width: 100%;
  min-height: 166px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${Fill.subtle};
  box-shadow: inset 0 0 0 1px ${Line.normal};
  white-space: pre-wrap;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 28px 20px;
`;
