import React,{useState,useEffect} from 'react';
import styled, {keyframes,css} from 'styled-components';

import Card from '@archiving/Card';
import Image from 'next/image';
import close from '@image/Frame 916.png';
import { Primary } from '@utils/constant/color';

type  ModalProps = {
    trackName: string;
    trackData: { id: number; title: string, category:string, thumbnail:string}[];
    handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    visible:boolean,
};


const SessionModal:React.FC<ModalProps> = ({trackData, trackName, handleClose, visible}) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (visible) {
            setIsOpen(true);
        } 
        else {
            timeoutId = setTimeout(() => setIsOpen(false), 300);
        }
    
        return () => {
            if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }};
    }, [visible]);
    
    return (
        <>
        {isOpen && 
        <>
        <StModalLayer onClick={handleClose} visible={visible}/>

        <StModalWrapper visible={visible}>
            <ModalHeader>
                <ImgWrapper onClick={handleClose}>
                    <Image src={close} width='35px' height='35px' alt='창닫기'/>
                </ImgWrapper>

                <ButtonWrapper>
                    <a>{trackName}</a>
                    <UploadButton>+</UploadButton>
                </ButtonWrapper>
            </ModalHeader>

            <CardWrapper>
                {trackData.slice(0).reverse().map((data,i)=>{
                    return(
                        <Card
                        key={data.id}
                        id= {data.id}
                        link='/session'
                        thumbnail={data.thumbnail}
                        title={data.title}
                        category={`${data.category}차 세션`} />
                        )
                    })}
            </CardWrapper>
        </StModalWrapper>
        </>
        }
        </>
    );
};

export default SessionModal;

const fadeIn = keyframes`
    0% {
    opacity: 0;
    }
    100% {
    opacity: 1;
    }
`;

const fadeOut = keyframes`
    0% {
    opacity: 1;
    }
    100% {
    opacity: 0;
    }
`;

const modalSettings = (visible: boolean) => css`
visibility: ${visible ? 'visible' : 'hidden'};
animation: ${visible ? fadeIn : fadeOut} 0.3s ease-out;
transition: visibility 0.3s ease-out;
`;


const StModalLayer = styled.div<{ visible: boolean }>`
display: flex;
justify-content: center;

position: fixed;
top: 0;
left: 0;
bottom: 0;
right: 0;
margin: auto;
background: rgba(0, 0, 0, 0.3);
z-index: 9999;
overflow: hidden;

${(props) => modalSettings(props.visible)};

/* animation: ${(props)=> props.visible ? fadeIn : fadeOut} 0s ease-out;
visibility: ${(props)=> props.visible ? 'visible' : 'hidden'};
transition: visibility 0s ease-out; */
`


const StModalWrapper = styled.div<{ visible: boolean }>`
display: flex;
flex-direction: column;
align-items: center;
z-index: 10000;
margin: auto;

position: absolute;
top: ${(props) => props.visible ?'5%': '15%'};
background: #FFFFFF;
box-shadow: 10px 10px 60px rgba(0, 0, 0, 0.4);
border-radius: 24px;
overflow: scroll;

${(props) => modalSettings(props.visible)};


//<전체보기> 눌렀을 때 모달창 초기 높이, 너비
@media (min-width: 1920px) {
    max-height: 100rem; 
    width: 150rem; 
}

@media (min-width: 1661px) and (max-width: 1919px) {
    max-height: 100rem; width:120rem; 
}

@media (min-width: 1220px) and (max-width: 1660px) {
    max-height: 100rem; width: 100rem; 
}

@media (min-width: 870px) and (max-width: 1221px) {
    max-height: 100rem; width: 80rem; 
}

@media (max-width: 871px) {
    max-height: 60rem; width: 50rem; height: 100rem;}

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

margin: 3rem 0 ;
`


const CardWrapper = styled.div`
display: grid;
background-color: white;
gap: 20px;
grid-template-columns: 1fr 1fr 1fr;

-ms-overflow-style: none; 
scrollbar-width: none;
::-webkit-scrollbar {
    display: none; 
}

overflow-y: visible;

@media (min-width: 1920px) {grid-template-columns: 1fr 1fr 1fr; gap: 20px;}

@media (min-width: 1220px) and (max-width: 1660px) {grid-template-columns: 1fr 1fr; gap: 30px;}

@media (min-width: 870px) and (max-width: 1221px) {grid-template-columns: 1fr 1fr; gap: 30px;;}

@media (min-width: 360px) and (max-width: 871px) {grid-template-columns: 1fr; gap: 30px;}

`


const UploadButton = styled.button`
border: none;
display: flex;
align-items: center;
justify-content: center;
position: relative;
width: 38px;
height: 38px;
border-radius: 50%;
font-size: 30px;
color: white;
background-color: ${Primary.default};
margin-left: 27px;
`;