import React, { KeyboardEventHandler, useRef } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

<<<<<<< HEAD
import { TodayAttendanceData } from '@@types/request';
=======
import { AttendanceData } from '@@types/request';
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
import { Primary } from '@utils/constant/color';

import InputBox from './InputBox';

import { getAttendance, postAttendance } from 'src/apis/attendance';

const AttendanceBox = () => {
  const router = useRouter();
  const InputRef = useRef<HTMLInputElement>(null);

<<<<<<< HEAD
  const { data, isLoading } = useQuery<TodayAttendanceData>(['attendance'], getAttendance);
=======
  const { data, isLoading } = useQuery<AttendanceData>(['attendance'], getAttendance);
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9

  if (data && data.isComplete) {
    router.push('/attendance/completed');
  }

  const attendancePost = useMutation({
    mutationFn: (password: string) => postAttendance(password),
    onSuccess: (res) => {
      if (res.status === 200) {
        router.push('/attendance/completed');
      }
    },
  });

  const handleClick = () => {
    if (InputRef.current) {
      if (InputRef.current.value === '1234') attendancePost.mutate(InputRef.current.value);
      else alert('비밀번호가 맞지 않습니다.');
    }
  };
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleClick();
  };
  if (isLoading)
    return (
      <Wrapper>
        <Title>로딩중...</Title>
      </Wrapper>
    );

  return (
    <Wrapper>
      <Title>오늘의 출석부</Title>
      <SquareWrapper>
        {[1, 2, 3].map((num) => (
          <Square key={num} />
        ))}
      </SquareWrapper>
      <InputBox title={'이 름'} detail={data!.name} />
      <InputBox title={'트 랙'} detail={data!.track} />
      <PasswordWrapper>
        <PasswordTitle>비밀번호</PasswordTitle>
        <PasswordInput type="password" ref={InputRef} required onKeyDown={handleEnter} />
      </PasswordWrapper>
      <SubmitButton onClick={handleClick}>출석하기</SubmitButton>
    </Wrapper>
  );
};
export default AttendanceBox;
const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-size: 3rem;
  font-weight: 700;
<<<<<<< HEAD
  @media (max-width: 900px) {
    margin-top: 30px;
    font-size: 2.5rem;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
const Square = styled.div`
  width: 9px;
  height: 9px;
  background: #1a21bd;
  transform: rotate(45deg);
  margin: 3px;
`;
const SquareWrapper = styled.div`
  display: flex;
  margin: 3.8rem 0;
<<<<<<< HEAD
  @media (max-width: 900px) {
    margin: 2rem;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
const PasswordWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;
const PasswordTitle = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.7rem;
  margin-right: 3rem;
<<<<<<< HEAD
  @media (max-width: 900px) {
    font-size: 1.5rem;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
const PasswordInput = styled.input`
  width: 25rem;
  height: 6rem;
  background-color: ${Primary.light};
  border-radius: 15px;
  border-style: none;
  font-size: 1.7rem;
  text-align: center;
<<<<<<< HEAD
  @media (max-width: 900px) {
    font-size: 1.5rem;
    height: 5rem;
    width: 15rem;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;

const SubmitButton = styled.div`
  cursor: pointer;
  background-color: ${Primary.default};
  color: white;
  width: 230px;
  height: 60px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 21px;
  margin-top: 20px;
<<<<<<< HEAD
  @media (max-width: 900px) {
    width: 80px;
    font-size: 15px;
    margin-top: 0px;
    height: 30px;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
