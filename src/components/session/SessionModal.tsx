import React,{useState,useEffect} from 'react';
import styled, {keyframes, css} from 'styled-components';
import Card from '@archiving/Card';
import { Primary } from '@utils/constant/color';
import back from '@image/back.png';
import Image from 'next/image';
import { ISessionData } from '@@types/request';

type  ModalProps = {
    trackName: string,
    trackData: ISessionData[];
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
            timeoutId = setTimeout(() => setIsOpen(false), 500);
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
                <ButtonWrapper>
                    <div>
                        <BackArrow src={back} className='arrow' width="30px" height="30px" alt='뒤로가기' onClick={handleClose}/>
                        <a>{trackName}</a>
                    </div>
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
                        category={`${data.degree}차 세션`} />
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
    0% { opacity: 0; }
    100% { opacity: 1; }
`;

const fadeOut = keyframes`
    0% { opacity: 1; }
    100% { opacity: 0; }
`;

const slideIn = keyframes`
    0% { transform: translateY(100%);}
    100% { transform: translateY(0); }
`

const slideOut = keyframes`
    0% { transform: translateY(0); }
    100% { transform: translateY(100%);}
`

const modalSettings = (visible: boolean) => css`
visibility: ${visible ? 'visible' : 'hidden'};
animation: ${visible ? fadeIn : fadeOut} 0.3s ease-out;
animation: ${visible ? slideIn : slideOut} 0.3s ease-out;
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

visibility: ${(props)=> props.visible ? 'visible' : 'hidden'};
animation: ${(props)=>props.visible ? fadeIn : fadeOut} 0.5s ease-out;
`

const StModalWrapper = styled.div<{ visible: boolean }>`
display: flex;
flex-direction: column;
align-items: center;
z-index: 10000;
position: absolute;
background: #FFFFFF;
box-shadow: 10px 10px 60px rgba(0, 0, 0, 0.4);
border-radius: 24px;
overflow: auto;
padding-bottom: 10rem;
padding: 0 5rem;
top: 5%;

::-webkit-scrollbar {
    display: none;
}

${(props) => modalSettings(props.visible)};


//<전체보기> 눌렀을 때 모달창 초기 높이, 너비
@media (min-width: 1920px) {
    max-height: 100rem; 
    width: 150rem;
}

@media (min-width: 1661px) and (max-width: 1919px) {
    max-height: 100rem; 
    width:120rem; 
}

@media (min-width: 901px) and (max-width: 1660px) {
    max-height: 100rem; 
    width: 100rem; 
}

@media (max-width: 900px) {
    height: 100vh; 
    width: 100%; 
    top: 0;
    border-radius: 0px;
}

`


const ModalHeader = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
width: 100%;

@media (max-width: 900px){
position: fixed;
top: 0;
left: 0;
height: 10rem;
z-index: 10001;
background-color: #FFFFFF;
border-bottom: solid 0.2rem #D7D7D7;
}
`

const ButtonWrapper = styled.div`
display:flex;
justify-content: space-between;
align-items: center;
margin: 3rem 1rem ;

div{
    display: flex;
    align-items: center;
    gap: 20px;
}
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

@media (min-width: 901px) and (max-width: 1660px) {grid-template-columns: 1fr 1fr; gap: 30px;}

@media (min-width:600px) and (max-width: 900px) { grid-template-columns: 1fr 1fr; gap:30px; padding-top: 15rem;}

@media (min-width: 360px) and (max-width: 601px) {grid-template-columns: 1fr; gap: 30px; padding-top: 15rem;}
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
`;

const BackArrow = styled(Image)`
visibility: hidden;

@media (max-width:900px){
    visibility: visible;
}
`