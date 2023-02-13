import Card from '@archiving/Card';
import React, {useState} from 'react';
import styled from 'styled-components';
import sessionData from './sessionData.json'

type  SliderProps = {
    translateVal: number;
    trackData: {id: number; title: string, category:string, thumbnail:string}[];
    trackNum: number,
};

type ImgBoxProps = {
    translateVal: number | null;
};


const Slider: React.FC<SliderProps> = ({translateVal, trackData, trackNum}) => {
    return (
        <StWrapper>
            <StImageBox 
            translateVal={translateVal !== 0 ? translateVal : null}>

                {trackData.map((data)=>{
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
            </StImageBox>

            


        </StWrapper>
    );
};

export default Slider;

const StWrapper=styled.div`
display: flex;
align-items: center;
`

const StImageBox = styled.div<ImgBoxProps>`
display:flex;
transition:1s;
transform:${({ translateVal }) => `translateX(-${translateVal}vw)`};


@media (min-width: 766px) and (max-width: 1123px) {
    width: 75%;
    gap: 20px;
}

@media (min-width: 1124px) and (max-width: 1919px) {
    width: 90%;
    gap: 20px;
}
@media (min-width: 1920px) {
    gap: 20px;
}

@media (min-width: 360px) and (max-width: 765px) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;
}
    
`

