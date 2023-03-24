import { BackgroundColor, Basic, GreyScale, Primary } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

interface IProps {
    title: string;
    toggle: boolean[];
    description: string;
    setToggle: (a: boolean[]) => void;
}

const ToggleBox = ({ title, toggle, description, setToggle }: IProps) => {
    const handleToggleButton = (i: number) => {
        const copy = new Array(toggle.length).fill(false);
        copy[i] = true;
        setToggle(copy);
    };
    return (
        <RowContainer>
            <Title>{title}</Title>
            <InputRow>
                <ToggleWrapper>
                    {toggle.map((t, i) => (
                        <ToggleItem key={i} >
                            <ButtonWrapper onClick={() => handleToggleButton(i)} isClicked={toggle[i]} >
                                <Button />
                            </ButtonWrapper>
                            <ToggleTitle>{title.split('/')[i]}</ToggleTitle>
                        </ToggleItem>
                    ))}
                </ToggleWrapper>
                <Description>*{description}</Description>
            </InputRow>
        </RowContainer>
    );
};

export default ToggleBox;

const RowContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    min-height: 100px;
    height: 100px;
    border-bottom: 1px solid ${GreyScale.default};
`;

const InputRow = styled.div`
    height: 60px;
    display: flex;
    align-items: center;
    padding: 20px;
    width: 100%;

    @media (max-width: 900px){
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }
`;

const Title = styled.div`
    flex-basis: 20%;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    background-color: ${Primary.light};
    height: 100%;
    min-width: 180px;
    padding: 1rem;
    display: flex;
    align-items: center;
`;

const ToggleWrapper = styled.div`
    display: flex;
    flex-basis: 35%;
`;

const Description = styled.div`
    font-size: 1.4rem;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    color: ${GreyScale.default};
`;

const ToggleItem = styled.div`
    width: 50%;
    display: flex;
    gap: 8px;
    align-items: center;
`;

const ButtonWrapper = styled.div<{ isClicked: boolean; }>`
    cursor: pointer;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background-color: ${props => props.isClicked ? Primary.default : GreyScale.light};
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Button = styled.div`
    background-color: ${BackgroundColor};
    width: 10px;
    height: 10px;
    border-radius: 100%;
`;

const ToggleTitle = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    color: ${Basic.default};
`;