import React from 'react';
import styled, {css} from 'styled-components';
import {useState} from 'react';
import SessionModal from './SessionModal';

type  TrackProps = {
    track: string,
    trackData: { id: number; title: string, category:string, thumbnail:string}[],
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

    const handleClose = (e: React.MouseEvent<HTMLElement, MouseEvent>): void  =>{
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
`

const StShowAll = styled.div`
color: #1A21BD;
font-size: 1.4rem;
`

