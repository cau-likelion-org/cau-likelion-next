import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { AttendanceStatusResponse, checkAttendance, getMyAttendances } from 'src/apis/attendance';
import useTokenStore from 'src/store/useTokenStore';
import { toDateString } from '@utils/index';
import { BackgroundWhite, Black, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

// 19:05 스케줄러가 미체크인원을 UNAUTHORIZED_ABSENT로 돌리지만, 22시 전까지는 늦게라도 체크인하면 LATE로 전환된다
const LATE_CHECK_IN_DEADLINE_HOUR = 22;

// 체크인 거절 사유(마감 시각 초과 등)는 서버 메시지를 그대로 보여준다
const getServerMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return undefined;
  const data: unknown = error.response?.data;
  if (typeof data === 'string') return data.trim() || undefined;
  const message = (data as { message?: unknown } | undefined)?.message;
  return typeof message === 'string' && message.trim() ? message : undefined;
};

// 출석체크 대상이 아닌 역할(운영진·회장·관리자·어른사자)은 조회 결과와 무관하게 비활성으로 보여준다
const AttendanceCheckCard = ({ isTarget = true }: { isTarget?: boolean }) => {
  const tokenState = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      setPassword('');
      setErrorMessage('');
      queryClient.invalidateQueries({ queryKey: ['myAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['myScore'] });
    },
    onError: (error) => {
      setErrorMessage(getServerMessage(error) ?? '입력값이 올바르지 않습니다.');
    },
  });

  const isCompleted = isTarget && (todayRecord?.status === 'PRESENT' || todayRecord?.status === 'LATE');
  // 무단결석으로 넘어갔어도 마감 시각 전이면 지각으로 만회할 수 있다
  const isLateWindow =
    todayRecord?.status === 'UNAUTHORIZED_ABSENT' && new Date().getHours() < LATE_CHECK_IN_DEADLINE_HOUR;
  const isAvailable = isTarget && !isLoading && (todayRecord?.status === 'BEFORE' || isLateWindow);

  // 체크할 수 없는 이유(조회 실패 / 출석부 미개설 / 마감 / 이미 처리됨)를 구분해서 안내한다
  const placeholder = (() => {
    if (!isTarget) return '출석체크 대상이 아니에요';
    if (isLoading) return '';
    if (isError) return '출석 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
    if (isAvailable) return '비밀번호를 입력해 주세요.';
    if (todayRecord?.status === 'UNAUTHORIZED_ABSENT') return '아직 출석체크 시간이 아니에요';
    if (todayRecord)
      return todayRecord.statusDescription
        ? `이미 ${todayRecord.statusDescription} 처리된 세션이에요`
        : '아직 출석체크 시간이 아니에요';
    return '아직 오늘의 출석체크가 열리지 않았어요';
  })();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = () => {
    if (!password) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }
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
          if (e.key === 'Enter') handleSubmit();
        }}
        trailingButton={{
          label: '출석체크',
          onClick: handleSubmit,
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
