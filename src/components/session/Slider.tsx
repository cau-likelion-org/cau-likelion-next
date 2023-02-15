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
    cloneDataNum:number;
};

type ImgBoxProps = {
    sessionImg:{id: number; title: string, category:string, thumbnail:string}[];
    translateVal: number;
    transition:string;
};



const Slider: React.FC<SliderProps> = ({translateVal, trackData, trackNum, sessionImg, transition, cloneDataNum}) => {
    const length = sessionImg.length;

    //translateVal===((복제한 데이터 배열 길이)-(추가한 데이터개수))면 슬라이더 끝에 도달했다는 것
    //=> 다시 첫번째 index로 돌려보내기 (translateVal=0)
    if (translateVal===sessionImg.length-cloneDataNum) {
        translateVal=0;
        transition='';
    };

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
gap: 20px;

// 버튼을 눌렀을 때-> 어떻게 이동할지 (*이동시간이 길어질수록 부드럽게 넘어감)
transition-duration: ${props=> props.transition};

// 버튼을 눌렀을 때-> 얼만큼 이동할지 (=이동범위)
//(-100 / props.sessionImg.length) *  (x + props.translateVal) 에서 x=클릭시 넘어갈 카드 수
transform:translateX(${props=> !props.translateVal ? 0 : (-100 / props.sessionImg.length) *  (1 + props.translateVal)}%);



`;

