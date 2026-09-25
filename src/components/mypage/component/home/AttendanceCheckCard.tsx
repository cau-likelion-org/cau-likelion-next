import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { AttendanceStatusResponse, checkAttendance, getMyAttendances } from 'src/apis/attendance';
import useTokenStore from 'src/store/useTokenStore';
import { getServerMessage, toDateString } from '@utils/index';
import { track, getDeviceType, newAttemptId } from 'src/lib/amplitude';
import { BackgroundWhite, Black, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

const INVALID_INPUT_SERVER_MESSAGE = '입력값이 올바르지 않습니다';
const WRONG_PASSWORD_MESSAGE = '비밀번호가 올바르지 않습니다.';

const classifyFailureReason = (error: unknown): 'wrong_password' | 'network_error' | 'server_error' => {
  if (!axios.isAxiosError(error) || !error.response) return 'network_error';
  return error.response.status >= 500 ? 'server_error' : 'wrong_password';
};

// 출석체크 대상이 아닌 역할(운영진·회장·관리자·어른사자)은 조회 결과와 무관하게 비활성으로 보여준다
const AttendanceCheckCard = ({ isTarget = true }: { isTarget?: boolean }) => {
  const tokenState = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const clickCountRef = useRef(0);
  const retryCountRef = useRef(0);
  const lastTriggerRef = useRef<'button_click' | 'enter_key'>('button_click');
  // 이 화면을 한 번 띄운 동안의 시도(제출·실패·완료)를 전부 같은 id로 묶어서, 같은 사람이
  // 나중에 다시 들어와 시도하는 것과 뒤섞이지 않게 한다
  const attemptSessionIdRef = useRef('');

  // 로그인 완료→출석 화면 진입까지 걸리는 시간을, 화면 진입 이후의 시간(Attendance Completed)과
  // 분리해서 볼 수 있도록 화면이 뜨는 시점을 따로 잡는다
  useEffect(() => {
    attemptSessionIdRef.current = newAttemptId();
    track('Attendance Screen Viewed', {
      is_target: isTarget,
      device_type: getDeviceType(),
      attempt_session_id: attemptSessionIdRef.current,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: records,
    isLoading,
    isError,
  } = useQuery<AttendanceStatusResponse[]>({
    queryKey: ['myAttendance'],
    queryFn: () => getMyAttendances(tokenState),
    retry: false,
    enabled: !!tokenState.access && isTarget,
  });

  // 오늘 날짜의 세션만 출석체크 대상이다. 세션이 없으면 체크할 것도 없다.
  const todayRecord = (records ?? []).find((record) => record.date === toDateString(new Date()));

  const checkIn = useMutation({
    mutationFn: (password: string) => checkAttendance(tokenState, password),
    onSuccess: () => {
      track('Attendance Completed', {
        device_type: getDeviceType(),
        click_count_since_login: clickCountRef.current,
        attendance_retry_count: retryCountRef.current,
        trigger_type: lastTriggerRef.current,
        attempt_session_id: attemptSessionIdRef.current,
      });
      setPassword('');
      setErrorMessage('');
      queryClient.invalidateQueries({ queryKey: ['myAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['myScore'] });
    },
    onError: (error) => {
      retryCountRef.current += 1;
      track('Attendance Failed', {
        attempt_session_id: attemptSessionIdRef.current,
        attempt_number: clickCountRef.current,
        failure_reason: classifyFailureReason(error),
        device_type: getDeviceType(),
      });
      const serverMessage = getServerMessage(error)?.trim();
      const isWrongPassword = !serverMessage || serverMessage.startsWith(INVALID_INPUT_SERVER_MESSAGE);
      setErrorMessage(isWrongPassword ? WRONG_PASSWORD_MESSAGE : serverMessage);
    },
  });

  const isCompleted = isTarget && (todayRecord?.status === 'PRESENT' || todayRecord?.status === 'LATE');
  // 22시 스케줄러가 무단결석으로 확정하기 전까지는 BEFORE로 유지되고, 지각 여부는 서버가 판단한다
  const isAvailable = isTarget && !isLoading && todayRecord?.status === 'BEFORE';

  // 체크할 수 없는 이유(조회 실패 / 출석부 미개설 / 마감 / 이미 처리됨)를 구분해서 안내한다
  const placeholder = (() => {
    if (!isTarget) return '출석체크 대상이 아니에요';
    if (isLoading) return '';
    if (isError) return '출석 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
    if (isAvailable) return '비밀번호를 입력해 주세요.';
    if (todayRecord)
      return todayRecord.statusDescription
        ? `${todayRecord.statusDescription} 처리되었습니다.`
        : '아직 출석체크 시간이 아니에요';
    return '아직 출석체크 시간이 아니에요';
  })();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (trigger: 'button_click' | 'enter_key' = 'button_click') => {
    if (!password) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }
    clickCountRef.current += 1;
    lastTriggerRef.current = trigger;
    track('Attendance Submitted', {
      attempt_session_id: attemptSessionIdRef.current,
      attempt_number: clickCountRef.current,
      trigger_type: trigger,
      device_type: getDeviceType(),
    });
    checkIn.mutate(password);
  };

  return (
    <Wrapper $active={isAvailable || isCompleted}>
      <Title>오늘의 출석체크</Title>
      <TextField
        type={isCompleted ? 'text' : 'password'}
        placeholder={placeholder}
        value={
          isCompleted ? (todayRecord?.status === 'LATE' ? '지각 처리되었습니다.' : '출석이 완료되었습니다.') : password
        }
        onChange={handlePasswordChange}
        disabled={!isAvailable && !isCompleted}
        readOnly={isCompleted}
        status={errorMessage ? 'negative' : isCompleted ? 'positive' : 'normal'}
        description={errorMessage || undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit('enter_key');
        }}
        trailingButton={{
          label: '출석체크',
          onClick: () => handleSubmit('button_click'),
          disabled: !isAvailable || checkIn.isPending,
        }}
      />
    </Wrapper>
  );
};

export default AttendanceCheckCard;

const Wrapper = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 13px;
  width: 100%;
  min-height: 152px;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid ${(props) => (props.$active ? Orange.o500 : Line.subtle)};
  background-color: ${(props) => (props.$active ? Orange.o50 : BackgroundWhite.secondary)};

  ${media.lg} {
    width: 520px;
  }

  ${media.xl} {
    flex-grow: 1;
  }
`;

const Title = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.heading1.bold)}
`;
