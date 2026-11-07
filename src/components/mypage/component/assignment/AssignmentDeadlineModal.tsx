import { useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ModalOverlay from '@common/modalOverlay/ModalOverlay';
import Radio from '@common/radio/Radio';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';
import useScrollLock from 'src/hooks/useScrollLock';
import { AssignmentStaffSummary } from 'src/apis/assignment';
import DateTimeInput from '@common/dateTimeInput/DateTimeInput';
import { Label, State, BackgroundColor } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface DeadlineTargetMember {
  memberId: number;
  memberName: string;
}

interface AssignmentDeadlineModalProps {
  assignments: AssignmentStaffSummary[];
  initialAssignmentId: number;
  members: DeadlineTargetMember[];
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (assignmentId: number, memberIds: number[], deadline: string) => void;
}

const AssignmentDeadlineModal = ({
  assignments,
  initialAssignmentId,
  members,
  submitting = false,
  onClose,
  onSubmit,
}: AssignmentDeadlineModalProps) => {
  useScrollLock();

  const [assignmentId, setAssignmentId] = useState(initialAssignmentId);
  const [deadline, setDeadline] = useState('');
  const [memberIds, setMemberIds] = useState<number[]>([]);

  const toggleMember = (id: number) =>
    setMemberIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));

  const selectedAssignment = assignments.find((assignment) => assignment.assignmentId === assignmentId);
  const titles = assignments.map((assignment) => assignment.title);

  const [isOpen, setIsOpen] = useState(false);
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options: titles,
    value: selectedAssignment?.title ?? '',
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onSelect: (title) => {
      const next = assignments.find((assignment) => assignment.title === title);
      if (next) setAssignmentId(next.assignmentId);
    },
  });

  const canSubmit = !!deadline && memberIds.length > 0 && !submitting;

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-label="개별 마감일 변경" onDimmerClick={onClose}>
      <Modal>
        <Information>
          <SelectField ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
            <LargeHeading>
              과제<LargeRequired>*</LargeRequired>
            </LargeHeading>
            <Select
              ref={triggerRef}
              aria-label="과제 선택"
              aria-expanded={isOpen}
              aria-controls={listId}
              aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
              value={selectedAssignment?.title ?? ''}
              placeholder="과제 선택"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen && (
                <ListboxOptions
                  listId={listId}
                  options={titles}
                  value={selectedAssignment?.title ?? ''}
                  activeIndex={activeIndex}
                  onSelect={selectOption}
                />
              )}
            </Select>
          </SelectField>

          <DateRow>
            <Field>
              <Heading>기존 마감일</Heading>
              <DateTimeInput value={selectedAssignment?.endDate ?? ''} placeholder="" readOnly />
            </Field>

            <Field>
              <Heading>
                변경 마감일<Required>*</Required>
              </Heading>
              <DateTimeInput aria-label="변경 마감일" value={deadline} onChange={setDeadline} />
            </Field>
          </DateRow>

          <Field>
            <Heading>
              변경 대상<Required>*</Required>
            </Heading>
            <MemberGrid role="group" aria-label="변경 대상">
              {members.map((member) => (
                <MemberRadio
                  key={member.memberId}
                  multiple
                  label={member.memberName}
                  checked={memberIds.includes(member.memberId)}
                  onChange={() => toggleMember(member.memberId)}
                />
              ))}
            </MemberGrid>
          </Field>
        </Information>

        <Actions>
          <Button variant="outlined" color="assistive" size="large" onClick={onClose}>
            취소
          </Button>
          <Button size="large" disabled={!canSubmit} onClick={() => onSubmit(assignmentId, memberIds, deadline)}>
            변경하기
          </Button>
        </Actions>
      </Modal>
    </ModalOverlay>
  );
};

export default AssignmentDeadlineModal;

const Modal = styled.div`
  position: relative;
  width: 502px;
  max-width: 100%;
  border-radius: 16px;
  background-color: ${BackgroundColor};
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 28px;
`;

const Field = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
`;

const SelectField = styled(Field)`
  position: relative;
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
  ${typographyCss(Typography.label1Normal.medium)}
`;

const DateRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 8px 0;
`;

const MemberRadio = styled(Radio)`
  padding: 6px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 28px 20px;
`;
