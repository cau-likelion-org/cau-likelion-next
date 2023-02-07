import React from 'react';
import styled from 'styled-components'

const Completed = () => {
    return (
        <Wrapper>
            <div />
            <p className='big'> 가입 완료! </p>
            <p className='small'> 중앙대 멋쟁이 사자처럼 회원이 된 것을 환영합니다! </p>
        </Wrapper>
    );
};

export default Completed;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;

    div{
        width: 360px;
        height: 360px;
        border: black solid 1px;
    }

    p{
        font-family: 'Pretendard';
        font-style: normal;
        margin: 0;
    }

    .big{
        font-size: 4rem;
        font-weight: 900;
        margin-top: 7rem;
    }

    .small{
        font-size: 1.4rem;
        font-weight: 500;
        margin-top: 1rem;

    }
`