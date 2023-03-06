import React from 'react';
import styled, {css} from 'styled-components';
import {useState} from 'react';
import SessionModal from './SessionModal';
import { ISessionData } from '@@types/request';

type  TrackProps = {
    track: string,
    trackData: ISessionData[],
};

const Track: React.FC<TrackProps> = ({track, trackData}) => {
    const [visible, setVisible]= useState(false);

    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>): void  =>{
        setVisible(true);

        document.body.style.cssText = `
        position: fixed; 
        width: 100%;
        `;
        
    }

    const handleClose = () => {
        setVisible(false);
        
        document.body.style.cssText = `
        position: ''; 
        width: ''`;
    }

    return (
        <>
            <StWrapper>
                <a>{track}</a>
                <StShowAll onClick={handleClick}>전체보기 &gt;</StShowAll>
            </StWrapper>

            <SessionModal 
                trackData={trackData}
                trackName={track}
                handleClose={handleClose}
                visible={visible}/>
        </>

    );
};

export default Track;

const StWrapper = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin: 3rem;
width: 100%;
z-index: 10;

@media (max-width:700px){
    margin: 3rem 0 5rem 0;

    a{
    font-size: 1.8rem;
}

}

`

const StShowAll = styled.div`
color: #1A21BD;
font-size: 1.4rem;
`