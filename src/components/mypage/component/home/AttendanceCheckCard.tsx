import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { AttendanceStatusResponse, checkAttendance, getMyAttendances } from 'src/apis/attendance';
import useTokenStore from 'src/store/useTokenStore';
import { getServerMessage, toDateString } from '@utils/index';
import { BackgroundWhite, Black, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

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
