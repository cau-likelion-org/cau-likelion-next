import React from 'react';
import styled from 'styled-components';
import thumbnail from '@image/활동기록보러가기.png';
import thumbnail2 from '@image/세션바로가기.jpeg';
import Image from 'next/image';
import ProjectButton from './component/ProjectButton';

const ProjectSection = () => {
    return (
        <Wrapper>
            <RowWrapper>
                <FirstFloat>
                    <Image src={thumbnail} width={'396px'} height={'396px'} alt="1st" />
                </FirstFloat>
                <SecondFloat>
                    <Image src={thumbnail2} width={'396px'} height={'396px'} alt="2nd" />
                </SecondFloat>
            </RowWrapper>
            <RowWrapper>
                <ThirdFloat>
                    <Image src={thumbnail2} width={'396px'} height={'396px'} alt="3rd" />
                </ThirdFloat>
                <FourthFloat>
                    <Image src={thumbnail} width={'396px'} height={'396px'} alt="4th" />
                </FourthFloat>
            </RowWrapper>
            <ButtonWrapper>
                <ProjectButton />
            </ButtonWrapper>
        </Wrapper>
    );
};

export default ProjectSection;


const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const FirstFloat = styled.div`
    &:hover{
        transform: scale(1.1, 1.1);
        transition: transform .5s;
    }
    max-height: 396px;
    max-width: 50%;
    overflow: hidden;
    float: left;
    object-fit: cover;     
    transform:scale(1.0);        
    transition: transform .5s; 
    overflow: hidden;

    img{
        border-radius: 3rem;
    }
`;
const SecondFloat = styled(FirstFloat)`
    float: right;
    margin-left: 7rem;
    margin-top: 24rem;
`;
const ThirdFloat = styled(FirstFloat)`
    margin-top: -17rem;
    margin-left: -17rem;

`;
const FourthFloat = styled(FirstFloat)`
    float: right;
    margin-top: 7rem;
    margin-left: 7rem;
`;

const RowWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
`;