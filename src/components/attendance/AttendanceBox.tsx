import LayoutAttendance from '@common/layout/LayoutAttendance';
import { Primary } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';
import InputBox from './InputBox';
const AttendanceBox = () => {
  return (
    <Wrapper>
      <Title>오늘의 출석부</Title>
      <SquareWrapper>
        {[1, 2, 3].map((num) => (
          <Square key={num} />
        ))}
      </SquareWrapper>
      <InputBox title={'이 름'} detail={''} />
      <InputBox title={'트 랙'} detail={''} />
      <PasswordWrapper>
        <PasswordTitle>비밀번호</PasswordTitle>
        <PasswordInput type="password" />
      </PasswordWrapper>
      <SubmitButton>출석하기</SubmitButton>
    </Wrapper>
  );
};
AttendanceBox.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutAttendance>{page}</LayoutAttendance>;
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
`;
const PasswordInput = styled.input`
  width: 25rem;
  height: 6rem;
  background-color: ${Primary.light};
  border-radius: 15px;
  border-style: none;
  font-size: 1.7rem;
`;

const SubmitButton = styled.div`
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
`;
