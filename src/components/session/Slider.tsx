import Card from '@archiving/Card';
import React, {useState} from 'react';
import styled from 'styled-components';

type SliderProps = {
    translateVal: number;
    images: { pic: string; id: number, session:number }[];
    moveRight: () => void;
    moveLeft: () => void;
};

type ImgBoxProps = {
    translateVal: number | null;
};


const Slider: React.FC<SliderProps> = ({translateVal, images, moveRight, moveLeft}) => {

    const clickRight = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveRight();
    };
    
    const clickLeft = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveLeft();
    };

    return (
        <StWrapper>
            <StImageBox 
            translateVal={translateVal !== 0 ? translateVal : null}>
                
                {images.map((picture, idx)=>{
                    return(
                        <Card
                        key={picture.id}
                        id= {picture.id}
                        link={'/'}
                        thumbnail={picture.pic}
                        title='첫번째 세션'
                        category={`${picture.session}번째 세션`} />

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

