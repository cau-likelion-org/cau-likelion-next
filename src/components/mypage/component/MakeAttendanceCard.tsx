import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import Toast from '@common/toast/Toast';
import { IcCalendar, IcRefresh } from '@assets/svg';
import {
  WeeklyAttendanceCreatePayload,
  WeeklyAttendanceResponse,
  createWeeklyAttendance,
  getWeeklyAttendanceByDate,
} from 'src/apis/attendance';
import useTokenStore from 'src/store/useTokenStore';
import { toDateString } from '@utils/index';
import { BackgroundWhite, Black, Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

const generatePassword = () => String(Math.floor(1000 + Math.random() * 9000));

const CREATE_LOCK_UNTIL_HOUR = 22;

const MakeAttendanceCard = () => {
  const tokenState = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const today = toDateString(new Date());
  const [date, setDate] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 날짜를 고르기 전에는 오늘 기준으로 본다
  const targetDate = date || today;

  // 해당 날짜에 출석부가 이미 있으면 그 내용을 보여주고 생성 영역을 잠근다.
  // 조회에 실패하면 잠그지 않는다(생성 자체를 막으면 안 되므로)
  const { data: existingAttendance } = useQuery<WeeklyAttendanceResponse | null>({
    queryKey: ['weeklyAttendance', targetDate],
    queryFn: () => getWeeklyAttendanceByDate(tokenState, targetDate),
    retry: false,
    enabled: !!tokenState.access,
  });

  const createMutation = useMutation({
    mutationFn: (payload: WeeklyAttendanceCreatePayload) => createWeeklyAttendance(tokenState, payload),
    onSuccess: () => {
      setIsToastOpen(true);
      queryClient.invalidateQueries({ queryKey: ['weeklyAttendance', targetDate] });
    },
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      const isDuplicate = status === 400 || status === 409;
      setSubmitError(isDuplicate ? '이미 출석부를 생성했어요.' : '출석부 생성에 실패했어요.');
    },
  });

  const isLockedByExisting =
    !!existingAttendance?.password && (targetDate !== today || new Date().getHours() < CREATE_LOCK_UNTIL_HOUR);
  const isCreated = createMutation.isSuccess || isLockedByExisting;
  const hasPassword = !!password;
  const canSave = !!date && !!weekNumber && hasPassword && !createMutation.isPending && !isCreated;
  const buttonDisabled = isCreated ? true : hasPassword ? !canSave : false;

  const displayDate = isLockedByExisting ? existingAttendance.date : date;
  const displayWeek = isLockedByExisting ? String(existingAttendance.weekNumber) : weekNumber;
  const displayPassword = isLockedByExisting ? existingAttendance.password : password;

  const handleWeekChange = (value: string) => setWeekNumber(value.replace(/\D/g, '').slice(0, 2));

  // 1단계: 비밀번호 생성 → 2단계: 저장(출석부 생성)
  const handleButtonClick = () => {
    if (isCreated) return;
    if (!hasPassword) {
      setPassword(generatePassword());
      return;
    }
    if (!canSave) return;
    setSubmitError('');
    createMutation.mutate({ date, password, weekNumber: Number(weekNumber) });
  };

  return (
    <Wrapper>
      <Content>
        <Title>출석부 만들기</Title>
        <FieldRow>
          <Field $width="158px" $mobileGrow>
            <FieldLabel>출석 일자 설정</FieldLabel>
            <DateInputWrapper $disabled={isCreated} onClick={() => dateInputRef.current?.showPicker?.()}>
              <IcCalendar width={22} height={22} />
              <DateValue $placeholder={!displayDate}>
                {displayDate ? displayDate.replace(/-/g, '/') : '캘린더 선택'}
              </DateValue>
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
                value={displayWeek}
                disabled={isCreated}
                onChange={(event) => handleWeekChange(event.target.value)}
                aria-label="주차 구분"
              />
            </InputBox>
          </Field>

          <Field $flex $mobileFull>
            <FieldLabel>비밀번호 생성</FieldLabel>
            <PasswordRow>
              <PasswordInputBox $disabled={isCreated}>
                <TextInput as="span" $placeholder={!displayPassword}>
                  {displayPassword || '랜덤 생성'}
                </TextInput>
                {hasPassword && (
                  <RefreshButton
                    type="button"
                    aria-label="비밀번호 재생성"
                    disabled={isCreated}
                    onClick={() => setPassword(generatePassword())}
                  >
                    <IcRefresh width={22} height={22} />
                  </RefreshButton>
                )}
              </PasswordInputBox>
              <GenerateButton type="button" disabled={buttonDisabled} onClick={handleButtonClick}>
                {displayPassword ? '저장' : '생성'}
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
  width: 100%;
  min-height: 152px;

  ${media.lg} {
    width: 520px;
  }
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

  /* 모바일은 출석 일자·주차 구분이 한 줄, 비밀번호 생성이 다음 줄 (Figma) */
  ${media.xs} {
    flex-wrap: wrap;
  }
`;

const Field = styled.div<{ $width?: string; $flex?: boolean; $mobileGrow?: boolean; $mobileFull?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${(props) => (props.$flex ? 'flex: 1 0 0; min-width: 0;' : `width: ${props.$width};`)}

  ${media.xs} {
    ${(props) => props.$mobileGrow && 'flex: 1 0 0; min-width: 0; width: auto;'}
    ${(props) => props.$mobileFull && 'flex: 0 0 100%; width: 100%;'}
  }
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
