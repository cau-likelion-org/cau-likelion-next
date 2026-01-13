import { BackgroundColor } from '@utils/constant/color';
import React, { useState } from 'react';
import styled from 'styled-components';
import { toDateString } from '@utils/index';
import { useMutation } from 'react-query';
import { makeAttendance } from 'src/apis/mypage';
import { useRecoilValue } from 'recoil';
import { token } from '@utils/state';
import { useRouter } from 'next/router';

const MakeAttendacneModal = () => {
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const today = new Date();
  const maxDate = new Date();
  const tokens = useRecoilValue(token);
  const router = useRouter();
  maxDate.setDate(today.getDate() + 7);

  const handleDateChange = (e: any) => {
    const inputDate = new Date(e.target.value);
    if (inputDate < today && inputDate > maxDate) return;
    setDate(e.target.value);
  };

  const handlePassWordChange = (e: any) => {
    if (e.target.value.length > 10) return;
    const result = e.target.value.replace(/\D/g, '');
    setPassword(result);
  };

  const make = useMutation({
    mutationFn: ({ date, password }: { date: string; password: string }) => makeAttendance(date, password, tokens),
    retry: false,
    onSuccess: (res) => {
      alert('생성 성공!');
      router.push('/mypage');
    },
    onError: (error: any) => {
      if (error.response.status === 400) {
        alert('해당 일자의 출석부가 존재합니다!');
      }
      alert('생성 실패!');
    },
  });

  const handleSubmit = () => {
    if (date && password) make.mutate({ date, password });
  };
  return (
    <Wrapper>
      <Title>출석부 만들기</Title>
      <Text>날짜</Text>
      <input type="date" onChange={handleDateChange} min={toDateString()} max={toDateString(maxDate)} />
      <Text>비밀번호</Text>
      <input type="text" onChange={handlePassWordChange} value={password} />
      <SubmitWrapper>
        <Submit onClick={handleSubmit}>생성하기</Submit>
      </SubmitWrapper>
    </Wrapper>
  );
};

export default MakeAttendacneModal;
const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 70%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  background-color: ${BackgroundColor};
  border-radius: 1rem;
  box-shadow: 10px 10px 30px 0px #00000014;
  padding: 2rem 5rem;
  z-index: 10001;
  &input {
    font-family: 'Pretendard';
    font-style: normal;
    font-size: 30px;
  }
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 800;
  font-size: 2.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #000000;
  border-bottom-style: solid;
  border-width: 1px;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;
const Submit = styled.div`
  cursor: pointer;
  background-color: #333333;
  border-radius: 25px;
  padding: 12px;
  color: #ffffff;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  padding-left: 30px;
  padding-right: 30px;
`;
const Text = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  color: #000000;
`;
const SubmitWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-top-style: solid;
  border-color: #000000;
  border-width: 1px;
  margin-top: 10px;
  padding-top: 10px;
`;
