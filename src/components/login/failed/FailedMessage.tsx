import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import alert from '@image/alert.png';

const FailedMessage = () => {
  return (
    <MessageWrapper>
      <div>
        <Image src={alert} alt="알림" width="20px" height="20px" />
        <StMessageText>알림</StMessageText>
      </div>
      <StMessageText>로그인 실패: 등록되지 않은 이메일입니다. 올바른 이메일을 입력해주세요.</StMessageText>
    </MessageWrapper>
  );
};

export default FailedMessage;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 46rem;
  height: 12rem;
  padding: 2rem 0;

  background: #f5f5f5;
  border-radius: 20px;

  div {
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      margin-left: 5px;
    }
  }
`;

const StMessageText = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  color: #2d2d2d;
`;
