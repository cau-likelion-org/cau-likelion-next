import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { Primary } from '@utils/constant/color';
import { MemberStack, MemberStackKor } from '@@types/request';
import {useState} from 'react';
import Card from '@archiving/Card';
import Image from 'next/image';
import close from '@image/Frame 916.png';
import more from '@image/Vector 18.png';
import UploadButton from './UploadButton';
import {useBodyScrollLock} from './scrollBlock'

type  TrackProps = {
    track: string,
    trackData: {id: number; title: string, category:string, thumbnail:string}[];
};

type ShowAllProps = {
    showAll:boolean;
}


const Track: React.FC<TrackProps> = ({track, trackData}) => {
    const [modal, setModal] = useState(true);
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

    const handleMore = (e: React.MouseEvent<HTMLElement, MouseEvent>): void  =>{
        setShowAll(true);

        console.log(showAll);
    }

    return (
        <>
        <StWrapper>
            <p> {track} </p>
            <StShowAll onClick={handleClick}>전체보기 &gt;</StShowAll>
        </StWrapper>

        {modal ?  
        <ModalBGWrapper>
            <ModalWrapper  showAll={showAll} >
                <ModalHeader>
                    <ImgWrapper onClick={handleClose}>
                        <Image src={close} width='35px' height='35px' alt='창닫기'/>
                    </ImgWrapper>

                    <ButtonWrapper>
                        <p>{track}</p>
                        <UploadButton/>
                    </ButtonWrapper>
                </ModalHeader>

                <CardWrapper showAll={showAll}>
                    {trackData.map((data,i)=>{
                        return(
                            <Card
                            key={data.id}
                            id= {data.id}
                            link={`/${data.id}`}
                            thumbnail={data.thumbnail}
                            title={data.title}
                            category={`${data.category}차 세션`} />
                        )
                        
                    })}
                </CardWrapper>

                <ModalFooter showAll={showAll}>
                    <ImgWrapper onClick={handleMore}>
                        <Image src={more} width='35px' height='20px' alt='창닫기'/>
                    </ImgWrapper>
                </ModalFooter>
        
            
            </ModalWrapper>
        </ModalBGWrapper> : null}
    

        </>

        
        
    );
};

export default Track;


const StWrapper = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`

const StShowAll = styled.div`
color:${Primary};
font-size: 1.4rem;
`

const ModalBGWrapper = styled.div`
display: flex;
justify-content: center;

position: fixed;
top: 0;
left: 0;
bottom: 0;
right: 0;

padding: 3rem 0 0 0;
background: rgba(0, 0, 0, 0.3);

z-index: 9999;

overflow: hidden;
`

const ModalWrapper = styled.div<ShowAllProps>`
display: flex;
flex-direction: column;
align-items: center;

top: 50%;
left: 50%;
width: 68%;
height: ${props=> !props.showAll ? '50rem' : 'auto'};

background: #FFFFFF;
box-shadow: 10px 10px 60px rgba(0, 0, 0, 0.4);
border-radius: 24px;

overflow-y: ${props=> !props.showAll ? 'hidden' : 'scroll'};

/* -ms-overflow-style: none; 
scrollbar-width: none;

::-webkit-scrollbar {
    display: none; 
} */

@media (min-width: 1920px) {
    min-height: 100rem;
}

@media (min-width: 1124px) and (max-width: 1919px) {
    min-height: 80rem;
}

@media (min-width: 766px) and (max-width: 1123px) {
    min-height: 50rem;
}

@media (min-width: 360px) and (max-width: 765px) {
    min-height: 30rem;
}

`


const ModalHeader = styled.div`
display: flex;
flex-direction: column;
width: 90%;
`

const ImgWrapper = styled.div`
display: flex;
justify-content: center;
padding: 2rem 0 1rem 0;
    
`

const ButtonWrapper = styled.div`
display:flex;
justify-content: space-between;
align-items: center;

`


const CardWrapper = styled.div<ShowAllProps>`
display: grid;
display: flex;
flex-wrap: wrap;

justify-content: center;
justify-content: space-evenly;
width: 90%;
background-color: white;

border: green 2px solid;




/* height: ${props=> !props.showAll ? '80rem' : '180rem'}; */
overflow-y: ${props=> !props.showAll ? 'hidden' : 'visible'};

-ms-overflow-style: none; 
scrollbar-width: none;
::-webkit-scrollbar {
    display: none; 
}

@media (min-width: 1920px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    
}

@media (min-width: 1124px) and (max-width: 1919px) {
    width: 80%;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
}

@media (min-width: 766px) and (max-width: 1123px) {
    width: 70%;
    grid-template-columns: 1fr;
    gap: 20px;
}


@media (min-width: 360px) and (max-width: 765px) {
    display: flex;
    /* height: ${props=> !props.showAll ? '30rem' : '100rem'}; */
    gap: 20px;
    align-items: center;
    justify-content: center;
}

`

const ModalFooter = styled.div<ShowAllProps>`
margin: 2rem 0;

visibility: ${props=> !props.showAll ? 'visbile' : 'hidden'};
`