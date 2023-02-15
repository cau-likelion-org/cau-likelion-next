import Card from '@archiving/Card';
import React, {useEffect, useState} from 'react';
import { useRecoilState_TRANSITION_SUPPORT_UNSTABLE } from 'recoil';
import { arrayBuffer } from 'stream/consumers';
import styled from 'styled-components';
import sessionData from './sessionData.json'

type  SliderProps = {
    translateVal: number;
    trackData: {id: number; title: string, category:string, thumbnail:string}[];
    trackNum: number,
    sessionImg:{id: number; title: string, category:string, thumbnail:string}[];
};

type ImgBoxProps = {
    // translateVal: number | null;
    sessionImg:{id: number; title: string, category:string, thumbnail:string}[];
    translateVal: number;
};




// translateVal={translateVal !== 0 ? translateVal : null}>
const Slider: React.FC<SliderProps> = ({translateVal, trackData, trackNum, sessionImg}) => {


    const length = sessionImg.length;

    function getImgIndex(idx:number){
        idx -= 3;
        if (idx<0) {idx += length;}
        else if (idx>=length) {idx -= length}

        return idx;
    }

    console.log(translateVal);
    console.log(length);

    const[moveX, setMoveX] = useState(0);


    return (
        <StWrapper>

            <StImageBox
                // translateVal={translateVal}
                translateVal={translateVal}
                sessionImg={sessionImg}>

                {sessionImg.map(
                    (data,i)=>{
                const imgIdx = getImgIndex(i);
                // console.log(data.title);
                // console.log(imgIdx);
                // console.log(i);
                // console.log('--------');

                    return(
                        <>
                        <Card
                        key={data.id}
                        id= {data.id}
                        link={`/${data.id}`}
                        thumbnail={data.thumbnail}
                        title={data.title}
                        category={`${data.category}차 세션`} />
                        </>
                    )

                    
                })}
            </StImageBox>

        </StWrapper>
    );
};

export default Slider;

const StWrapper=styled.div`
display: flex;

width: 70vw;
overflow:hidden;
`

const StImageBox = styled.div<ImgBoxProps>`
display:flex;
transition: transform ease 1s; 
gap: 20px;

//-1 * (슬라이드 한 개의 너비의 반) + (슬라이드 한 개의 너비 * 현재 슬라이드 index)%만큼 이동
transform:translateX(${props=> !props.translateVal ? 0 : (-100 / props.sessionImg.length  ) *  (0.5 + props.translateVal)}%);



`;




// @media (min-width: 1920px) {
//     width: 380px;
//     height: 400px;
//   }
//   @media (min-width: 360px) and (max-width: 1919px) {
//     width: 330px;
//     height: 370px;
//   }

