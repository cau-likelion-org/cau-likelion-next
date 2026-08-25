import { useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Radio from '@common/radio/Radio';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';
import useScrollLock from 'src/hooks/useScrollLock';
import { AssignmentStaffSummary } from 'src/apis/assignment';
import { IcCalendar } from '@assets/svg';
import { Fill, Label, Line, Material, State, BackgroundColor } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const formatDate = (value: string) => (value ? value.slice(0, 10).replace(/-/g, '/') : '');

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
    <Overlay role="dialog" aria-modal="true" aria-label="개별 마감일 변경">
      <Dimmer onClick={onClose} />
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
            />
            {isOpen && (
              <ListboxOptions
                listId={listId}
                options={titles}
                value={selectedAssignment?.title ?? ''}
                activeIndex={activeIndex}
                onSelect={selectOption}
              />
            )}
          </SelectField>

          <DateRow>
            <Field>
              <Heading>기존 마감일</Heading>
              <ReadonlyDateBox>
                <DateIcon>
                  <IcCalendar width={22} height={22} />
                </DateIcon>
                <DateText>{formatDate(selectedAssignment?.endDate ?? '')}</DateText>
              </ReadonlyDateBox>
            </Field>

            <Field>
              <Heading>
                변경 마감일<Required>*</Required>
              </Heading>
              <DateBox>
                <DateIcon>
                  <IcCalendar width={22} height={22} />
                </DateIcon>
                <DateText $filled={!!deadline}>{deadline ? formatDate(deadline) : '캘린더 선택'}</DateText>
                <HiddenDateInput
                  type="date"
                  aria-label="변경 마감일"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  onClick={(event) => event.currentTarget.showPicker?.()}
                />
              </DateBox>
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
    </Overlay>
  );
};

export default AssignmentDeadlineModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 1000;
`;

const Dimmer = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${Material.dimmer};
  opacity: 0.43;
`;

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

const dateBoxCss = `
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  padding: 12px;
  border-radius: 12px;
`;

const DateBox = styled.div`
  ${dateBoxCss}
  box-shadow: inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1);

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

// 기존 마감일: 읽기 전용 (Figma Fill/Alternative 배경 + Line/Normal/Alternative 테두리)
const ReadonlyDateBox = styled.div`
  ${dateBoxCss}
  background-color: ${Fill.subtle};
  box-shadow:
    inset 0 0 0 1px ${Line.subtle},
    0 1px 2px 0 rgba(0, 0, 0, 0.03);
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
