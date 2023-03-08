import { BackgroundColor, Basic, GreyScale, Primary } from '@utils/constant/color';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx';

interface IProps {
    title: string;
    menu: string[];
    description: string;
    selectedMenu: string;
    setSelectedMenu: (v: string) => void;
}

const DropdownMenuBox = ({ title, menu, description, selectedMenu, setSelectedMenu }: IProps) => {
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    const wrapperRef = useRef() as React.MutableRefObject<HTMLDivElement>;

    const handleClickMenu = (m: string) => {
        setSelectedMenu(m);
        setDropdownVisibility(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    });

    const handleClickOutside = (e: any) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setDropdownVisibility(false);
        }
        else {
            setDropdownVisibility(true);
        }
    };

    return (
        <RowContainer>
            <Title>{title}</Title>
            <InputRow>
                <Dropdown ref={wrapperRef}>
                    {selectedMenu}
                    {dropdownVisibility &&
                        <DropdownList >
                            {menu.map((m, i) => (
                                <MenuItem key={i} onClick={() => handleClickMenu(m)}>{m}</MenuItem>
                            ))}
                        </DropdownList>
                    }
                    {dropdownVisibility ? <RxTriangleUp /> : <RxTriangleDown />}
                </Dropdown>
                <Description>*{description}</Description>
            </InputRow>
        </RowContainer>
    );
};

export default DropdownMenuBox;

const RowContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    min-height: 100px;
    height: 100px;
    border-bottom: 1px solid ${GreyScale.default};
`;


const Title = styled.div`
    flex-basis: 20%;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    height: 100%;
    background-color: ${Primary.light};
    min-width: 180px;
    padding: 1rem;
    display: flex;
    align-items: center;
`;
const InputRow = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;

    @media (max-width: 900px){
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }
`;

const Description = styled.div`
    font-size: 1.4rem;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    color: ${GreyScale.default};
`;

const Dropdown = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-basis: 45%;
    justify-content: space-between;
    height: 45px;
    border: 1px solid ${GreyScale.default};
    border-radius: 1rem;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    color: ${GreyScale.default};
    position: relative;
    padding: 1rem;

`;

const DropdownList = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 18px;
    right: 0;
    z-index: 1;
    width: 50%;
    border-radius: 1rem;
    background-color: ${BackgroundColor};
    box-shadow: 10px 10px 30px 0px #00000014;
    cursor: pointer;
    padding: 1rem;

`;

const MenuItem = styled.div`
    padding: 1rem;
    border-radius: 1rem;
    &:hover{
        background-color: ${GreyScale.light};
    }
`;