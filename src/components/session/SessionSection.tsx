import React,{useState} from 'react';
import styled from 'styled-components';
import { Primary } from '@utils/constant/color';
import Link from 'next/link';
import Track from './Track';
import { MemberStack, MemberStackKor } from '@@types/request';
import Card from '@archiving/Card';
import Slider from './Slider';
import Arrow from './Arrow';
import sessionData from './sessionData.json'

console.log(sessionData);

const pmData = sessionData[0];




const SessionSection = ({track}:{track:string}) => {

    const images = [
        { pic: 'https://cau-likelion.s3.ap-northeast-2.amazonaws.com/project-img/9%E1%84%80%E1%85%B5/Rectangle_336-1.png', id: 1, session:1 },
        { pic: 'https://cau-likelion.s3.ap-northeast-2.amazonaws.com/project-img/9%E1%84%80%E1%85%B5/Rectangle_336-2.png', id: 2, session:2 },
        { pic: 'https://cau-likelion.s3.ap-northeast-2.amazonaws.com/project-img/9%E1%84%80%E1%85%B5/Rectangle_336-3.png', id: 3, session:3 },
        { pic: 'https://cau-likelion.s3.ap-northeast-2.amazonaws.com/project-img/9%E1%84%80%E1%85%B5/Rectangle_336-4.png', id: 4, session:4 },
        { pic: 'https://cau-likelion.s3.ap-northeast-2.amazonaws.com/project-img/9%E1%84%80%E1%85%B5/Rectangle_336-5.png', id: 5, session:5 },
    ];


    const [translateVal, setTranslateVal] = useState<number>(0);

    const moveRight = (): void => {
        if (translateVal !== 70 * (images.length - 1)) {
            setTranslateVal((prev) => prev + 70);
        } else {
            setTranslateVal(0);
        }
    };

    const moveLeft = (): void => {
        if (translateVal !== 0) {
            setTranslateVal((prev) => prev - 70);
        } else {
          setTranslateVal(70 * (images.length - 1));
        }
    };

    const clickRight = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveRight();
    };

    const clickLeft = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveLeft();
    };


    return (
        <StWrapper>
            <Track track={track} />

            <StSliderRowWrapper>

                <div onClick={clickLeft}><Arrow direction='left' /></div>
                <StSliderWrapper>
                        <Slider
                        translateVal={translateVal}
                        images={images} 
                        moveRight={moveRight}
                        moveLeft={moveLeft} />
                </StSliderWrapper>
                <div onClick={clickRight}><Arrow direction='right' /></div>

            </StSliderRowWrapper> 

        </StWrapper>
    );
}
export default SessionSection;

const StWrapper= styled.div`
font-family: 'Pretendard';
font-style: normal;
font-weight: 900;
font-size: 4rem;

@media (max-width: 1550px) {
        font-size: 2.3rem;
    }

`

const StSliderWrapper = styled.div`
position:relative;
max-width:70vw;
height:45rem;
display:flex;
overflow:hidden;
margin:0 auto;
`;

const StArrowWrapper = styled.div`

    
`

const StSliderRowWrapper = styled.div`
display: flex;
align-items: center;

.moveToLeft{
    margin-right:70px;
    transform: rotate(180deg);

    /* visibility: hidden; */

}

.moveToRight{
    margin-left:70px
}

    
`




