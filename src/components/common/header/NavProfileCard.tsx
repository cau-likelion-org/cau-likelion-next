import { GreyScale } from '@utils/constant/color';
import { accessToken } from '@utils/state';
import Link from 'next/link';
import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const NavProfileCard = () => {
    const tokenState = useRecoilValue(accessToken);

    return (
        <Wrapper>
            {tokenState ?
                <>
                    <Link href='/mypage'>
                        <Name>
                            <span>윤선영</span>님
                        </Name>
                    </Link>
                    <Link href='/mypage'>
                        <MyButton>MY</MyButton>
                    </Link></>
                :
                <Link href='/login'><Name><span>로그인</span></Name></Link>
            }
        </Wrapper>
    );
};

export default NavProfileCard;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    padding: 2rem 4rem 2rem 4rem;
    border-bottom: 2px solid ${GreyScale.light};
`;

const Name = styled.div`
    cursor: pointer;
    & > span {
        font-weight: 800;
        font-size: 1.9rem;
    }
    gap: 3px;
    background: none;
    border: none;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const MyButton = styled.div`
    cursor: pointer;
    border: 1px solid ${GreyScale.default};
    color: ${GreyScale.default};
    font-size: 0.8rem;
    font-weight: 500;
    border-radius: 1rem;
    padding: 3px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
`;