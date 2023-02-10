import { BackgroundColor } from '@utils/constant/color';
import { accessToken } from '@utils/state';
import React from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { IMenu } from './NavBar';
import NavButton from './NavButton';
import NavProfileCard from './NavProfileCard';

const MobileNavModal = ({ isModalOn }: { isModalOn: boolean; }) => {
    const [tokenState, setTokenState] = useRecoilState(accessToken);

    const menu: IMenu[] = [
        { title: '프로젝트', routing: '/project' },
        { title: '세션', routing: '/session' },
        { title: '추억', routing: '/gallery' },
    ];

    return (
        <>
            <Layer isModalOn={isModalOn} />
            <Wrapper className={isModalOn ? 'slide-fade-in-dropdown' : 'slide-fade-out-dropdown'}>
                <NavProfileCard />
                <ButtonWrapper>
                    {tokenState && <NavButton title={'출석체크'} routing={'/attendance'} />}
                    {menu.map((m, i) => (
                        <NavButton key={i} title={m.title} routing={m.routing} />
                    ))}
                </ButtonWrapper>
            </Wrapper>
        </>
    );
};

export default MobileNavModal;

const Layer = styled.div<{ isModalOn: boolean; }>`

    display: ${props => props.isModalOn ? 'block' : 'none'};

    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 101%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9997;
    @media(min-width: 900px) {
        display: none;
    }
`;

const Wrapper = styled.div`

    @keyframes slide-fade-out-dropdown-animation {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-100%);
        }
    }

    @keyframes slide-fade-in-dropdown-animation {
        0% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(0);
        }
    }

    &.slide-fade-in-dropdown {
        animation: slide-fade-in-dropdown-animation .4s ease;
    }

    &.slide-fade-out-dropdown {
        animation: slide-fade-out-dropdown-animation .4s ease;
        animation-fill-mode: forwards;
    }

    position: fixed;
    left: 0;
    width: 101%;
    top: 51.5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${BackgroundColor};
    border-radius: 0 0 1rem 1rem;
    box-shadow: 10px 10px 30px 0px #00000014;
    padding-left: 4rem;
    padding-right: 4rem;
    z-index: 9998;
    min-height: 300px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    align-items: flex-start;
    gap: 5px;
`;