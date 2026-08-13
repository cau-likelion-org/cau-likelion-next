import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Toast from '@common/toast/Toast';
import IcCalender from '@assets/svg/ic-calender.svg';
import { IcRefresh } from '@assets/svg';
import { WeeklyAttendanceCreatePayload, createWeeklyAttendance } from 'src/apis/attendance';
import useTokenStore from 'src/store/useTokenStore';
import { toDateString } from '@utils/index';
import { BackgroundWhite, Black, Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const generatePassword = () => String(Math.floor(1000 + Math.random() * 9000));

const MakeAttendanceCard = () => {
  const tokenState = useTokenStore((state) => state.token);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const today = toDateString(new Date());
  const [date, setDate] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const createMutation = useMutation({
    mutationFn: (payload: WeeklyAttendanceCreatePayload) => createWeeklyAttendance(tokenState, payload),
    onSuccess: () => setIsToastOpen(true),
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      setSubmitError(status === 400 ? '해당 일자의 출석부가 이미 존재해요.' : '출석부 생성에 실패했어요.');
    },
  });

  const isCreated = createMutation.isSuccess;
  const canSubmit = !!date && !!weekNumber && !!password && !createMutation.isPending && !isCreated;

  const handleWeekChange = (value: string) => setWeekNumber(value.replace(/\D/g, '').slice(0, 2));

  const handleCreate = () => {
    if (!canSubmit) return;
    setSubmitError('');
    createMutation.mutate({ date, password, weekNumber: Number(weekNumber) });
  };

  return (
    <Wrapper>
      <Content>
        <Title>출석부 만들기</Title>
        <FieldRow>
          <Field $width="158px">
            <FieldLabel>출석 일자 설정</FieldLabel>
            <DateInputWrapper $disabled={isCreated} onClick={() => dateInputRef.current?.showPicker?.()}>
              <IcCalender width={22} height={22} />
              <DateValue $placeholder={!date}>{date ? date.replace(/-/g, '/') : '캘린더 선택'}</DateValue>
              <HiddenDateInput
                ref={dateInputRef}
                type="date"
                value={date}
                min={today}
                disabled={isCreated}
                onChange={(event) => setDate(event.target.value)}
                aria-label="출석 일자 설정"
              />
            </DateInputWrapper>
          </Field>

          <Field $width="100px">
            <FieldLabel>주차 구분</FieldLabel>
            <InputBox $disabled={isCreated}>
              <TextInput
                inputMode="numeric"
                placeholder="숫자 입력"
                value={weekNumber}
                disabled={isCreated}
                onChange={(event) => handleWeekChange(event.target.value)}
                aria-label="주차 구분"
              />
            </InputBox>
          </Field>

          <Field $flex>
            <FieldLabel>비밀번호 생성</FieldLabel>
            <PasswordRow>
              <PasswordInputBox $disabled={isCreated}>
                <TextInput as="span" $placeholder={!password}>
                  {password || '랜덤 생성'}
                </TextInput>
                <RefreshButton
                  type="button"
                  aria-label="비밀번호 생성"
                  disabled={isCreated}
                  onClick={() => setPassword(generatePassword())}
                >
                  <IcRefresh width={22} height={22} />
                </RefreshButton>
              </PasswordInputBox>
              <GenerateButton type="button" disabled={!canSubmit} onClick={handleCreate}>
                생성
              </GenerateButton>
            </PasswordRow>
          </Field>
        </FieldRow>
      </Content>

      <ToastWrapper>
        <Toast
          variant="positive"
          text="출석 비밀번호가 생성되었습니다."
          show={isToastOpen}
          onHidden={() => setIsToastOpen(false)}
        />
        <Toast variant="negative" text={submitError} show={!!submitError} onHidden={() => setSubmitError('')} />
      </ToastWrapper>
    </Wrapper>
  );
};

export default MakeAttendanceCard;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 520px;
  min-height: 152px;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid ${Line.subtle};
  background-color: ${BackgroundWhite.secondary};
`;

const Content = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  opacity: 0.8;
`;

const Title = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.heading1.bold)}
`;

const FieldRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  width: 100%;
`;

const Field = styled.div<{ $width?: string; $flex?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${(props) => (props.$flex ? 'flex: 1 0 0; min-width: 0;' : `width: ${props.$width};`)}
`;

const FieldLabel = styled.span`
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const inputBoxCss = `
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);
`;

const DateInputWrapper = styled.div<{ $disabled: boolean }>`
  position: relative;
  ${inputBoxCss}
  color: ${Label.normal};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
`;

const DateValue = styled.span<{ $placeholder: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  color: ${(props) => (props.$placeholder ? Label.assistive : Label.normal)};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const HiddenDateInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  opacity: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const InputBox = styled.div<{ $disabled: boolean }>`
  ${inputBoxCss}
  width: 100%;

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const TextInput = styled.input<{ $placeholder?: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  border: none;
  outline: none;
  background: none;
  padding: 0 4px;
  color: ${(props) => (props.$placeholder ? Label.assistive : Label.normal)};
  ${typographyCss(Typography.body1Normal.regular)}

  &::placeholder {
    color: ${Label.assistive};
  }
`;

const PasswordRow = styled.div`
  display: flex;
  width: 100%;
`;

const PasswordInputBox = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 12px;
  border-radius: 12px 0 0 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);
`;

const RefreshButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.normal};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const GenerateButton = styled.button`
  flex-shrink: 0;
  min-width: 80px;
  padding: 12px 16px;
  border: none;
  border-radius: 0 12px 12px 0;
  background: none;
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px rgba(0, 0, 0, 0.03);
  color: ${State.info};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.bold)}

  &:disabled {
    color: ${Label.assistive};
    cursor: not-allowed;
  }
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
