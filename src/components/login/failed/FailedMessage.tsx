import React from 'react';
import styled from 'styled-components'
import Image from 'next/image';

import alert from '@image/alert.png'

const FailedMessage = () => {
    return (
        <MessageWrapper>
            <div>
                <Image src={alert} alt='알림' width='20px' height='20px'/>
                <StMessageText>알림</StMessageText>
            </div>
            <StMessageText>LIKE LION 계정으로만 로그인이 가능합니다.</StMessageText>

        </MessageWrapper>
    );
};

export default FailedMessage;

const MessageWrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: space-evenly;
align-items: center;

width: 46rem;
height: 12rem;
padding: 2rem 0;

background: #F5F5F5;
border-radius: 20px;

div{
    display: flex;
    justify-content: center;
    align-items: center;

    div{
        margin-left: 5px;
    }

}

`

const StMessageText = styled.div`
font-family: 'Pretendard';
font-style: normal;
font-weight: 500;
font-size: 17px;
color: #2D2D2D;

/* margin-top: 7px; */
`

