import styled from 'styled-components';

import Button from '@common/button/Button';
import LinkifiedText from './LinkifiedText';
import { Fill, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import SendTargetChipList from './SendTargetChipList';
import EmailModalLayout, { Field, LargeHeading, LargeRequired } from './EmailModalLayout';

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
  return (
    <EmailModalLayout
      ariaLabel="실패건 즉시 재발송"
      onClose={onClose}
      actions={
        <Actions>
          <Button variant="outlined" color="assistive" size="large" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button size="large" onClick={onConfirm} loading={isSubmitting} disabled={recipients.length === 0}>
            즉시 발송하기
          </Button>
        </Actions>
      }
    >
      <Field>
        <LargeHeading>
          발송 대상<LargeRequired>*</LargeRequired>
        </LargeHeading>
        <RecipientBox>
          <RecipientSummaryRow>
            <SendTargetChipList
              chips={recipients.map((email, index) => ({ key: `${email}-${index}`, label: email }))}
            />
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
    </EmailModalLayout>
  );
};

export default RecruitmentResendModal;

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
