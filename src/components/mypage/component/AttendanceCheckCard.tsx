import { useState } from 'react';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { getAttendance, postAttendance } from 'src/apis/attendance';
import useTokenStore from 'src/store/useTokenStore';
import { TodayAttendanceData } from '@@types/request';
import { BackgroundWhite, Black, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 출석체크 대상이 아닌 역할(운영진·회장·관리자·어른사자)은 조회 결과와 무관하게 비활성으로 보여준다
const AttendanceCheckCard = ({ isTarget = true }: { isTarget?: boolean }) => {
  const tokenState = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const { data, isLoading, error } = useQuery<TodayAttendanceData, AxiosError>({
    queryKey: ['attendance'],
    queryFn: () => getAttendance(tokenState),
    retry: false,
    enabled: !!tokenState.access && isTarget,
  });

  const checkIn = useMutation({
    mutationFn: (password: string) => postAttendance(password, tokenState),
    onSuccess: () => {
      setPassword('');
      setPasswordError(false);
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['userAttendance'] });
    },
    onError: () => {
      setPasswordError(true);
    },
  });

  const isCompleted =
    isTarget &&
    ((data && (data.attendance_result === 1 || data.attendance_result === 2)) || error?.response?.status === 405);
  const isAvailable = isTarget && !isLoading && !error && !!data && !isCompleted;

  const placeholder = !isTarget
    ? '출석체크 대상이 아니에요'
    : isLoading
      ? ''
      : isAvailable
        ? '비밀번호를 입력해 주세요.'
        : error?.response?.status === 406
          ? '출석체크 대상이 아니에요'
          : '아직 출석체크 시간이 아니에요';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(false);
  };

  const handleSubmit = () => {
    if (password) checkIn.mutate(password);
  };

  return (
    <Wrapper $active={isAvailable || isCompleted}>
      <Title>오늘의 출석체크</Title>
      <TextField
        type={isCompleted ? 'text' : 'password'}
        placeholder={placeholder}
        value={isCompleted ? '출석이 완료되었습니다.' : password}
        onChange={handlePasswordChange}
        disabled={!isAvailable && !isCompleted}
        readOnly={isCompleted}
        status={passwordError ? 'negative' : isCompleted ? 'positive' : 'normal'}
        description={passwordError ? '비밀번호가 올바르지 않습니다.' : undefined}
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
  width: 520px;
  min-height: 152px;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid ${(props) => (props.$active ? Orange.o500 : Line.subtle)};
  background-color: ${(props) => (props.$active ? Orange.o50 : BackgroundWhite.secondary)};

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const Title = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.heading1.bold)}
`;
