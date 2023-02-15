import React from 'react';
import styled from 'styled-components';
import { Primary } from '@utils/constant/color';
import {useState} from 'react';

import {useBodyScrollLock} from './scrollBlock'
import SessionModal from './SessionModal';

type  TrackProps = {
    track: string,
    trackData: {id: number; title: string, category:string, thumbnail:string}[];
};

const Track: React.FC<TrackProps> = ({track, trackData}) => {
    const [modal, setModal] = useState(false);
    const [showAll, setShowAll]= useState(false);

    const {lockScroll, openScroll} = useBodyScrollLock();


    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>): void  =>{
        setModal(!modal);
        lockScroll();
    }

    const handleClose = (e: React.MouseEvent<HTMLElement, MouseEvent>): void  =>{
        setModal(false);
        setShowAll(false);
        openScroll();
    }


    return (
        <>
        <StWrapper>
            <a>{track}</a>
            <StShowAll onClick={handleClick}>전체보기 &gt;</StShowAll>
        </StWrapper>

        {modal && (  
            <SessionModal 
            trackData={trackData}
            trackName={track}
            handleClose={handleClose}
            />
        )}
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
