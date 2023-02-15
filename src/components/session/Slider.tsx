import Card from '@archiving/Card';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import sessionData from './sessionData.json'

type  SliderProps = {
    translateVal: number;
    trackData: {id: number; title: string, category:string, thumbnail:string}[];
    trackNum: number,
    sessionImg:{id: number; title: string, category:string, thumbnail:string}[];
    transition:string
};

type ImgBoxProps = {
    sessionImg:{id: number; title: string, category:string, thumbnail:string}[];
    translateVal: number;
    transition:string;
};




// translateVal={translateVal !== 0 ? translateVal : null}>
const Slider: React.FC<SliderProps> = ({translateVal, trackData, trackNum, sessionImg, transition}) => {
    const length = sessionImg.length;

    return (
        <StWrapper>

            <StImageBox
                translateVal={translateVal}
                sessionImg={sessionImg}
                transition={transition}>
                
            
                {sessionImg.map(
                    (data,i)=>{
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
overflow: hidden;
width: 70vw;
`

const StImageBox = styled.div<ImgBoxProps>`
display:flex;
transition: transform ease 1s; 
/* transition-duration: (${props=> props.transition}s); */
/* transition: (${props=> (props.translateVal===props.sessionImg.length-3) ? 'transform ease 1s' : 'transform ease 0s'}) ; */
gap: 20px;

//-1 * (슬라이드 한 개의 너비의 반) + (슬라이드 한 개의 너비 * 현재 슬라이드 index)%만큼 이동
transform:translateX(${props=> !props.translateVal ? 0 : (-100 / props.sessionImg.length) *  (0.5 + props.translateVal)}%);



`;

