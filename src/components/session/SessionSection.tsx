import React from 'react';
import styled from 'styled-components';
import Track from './Track';
import Arrow from './Arrow';
import Slick from './Slick';


type  SessionProps = {
    trackName: string;
    trackData: { id: number; title: string, category:string, thumbnail:string}[];
};

const SessionSection:React.FC<SessionProps> =({trackName, trackData}) => {
    
    return (
        <>
        <StWrapper>
            <Track track={trackName} trackData={trackData} />

            <StSlideWrapper>
                <Arrow direction='left' />
                <Slick
                    trackData={trackData}
                    trackName={trackName}/>
                <Arrow direction='right' />
            </StSlideWrapper>

        </StWrapper>
        </>
    );
}
export default SessionSection;

const StWrapper= styled.div`
display: flex;
flex-direction: column;
align-items: center;

font-family: 'Pretendard';
font-style: normal;
font-weight: 900;
font-size: 4rem;
width: 100%;

@media (max-width: 1550px) { font-size: 2.3rem;}
`

const StSlideWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`





