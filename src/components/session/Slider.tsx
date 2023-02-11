import Card from '@archiving/Card';
import React, {useState} from 'react';
import styled from 'styled-components';
import rightArrow from '@image/Vector 16.png'
import Image from 'next/image'

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
    const [mouseDownClientX, setMouseDownClientX] = useState<number>(0);
    const [mouseUpClientX, setMouseUpClientX] = useState<number>(0);
    const [cursorOn, setCursorOn] = useState<boolean>(false);

    const clickRight = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveRight();
    };
    
    const clickLeft = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveLeft();
    };

    return (
        <StWrapper>
            <StImageBox 
            translateVal={translateVal !== 0 ? translateVal : null}
            >
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

            <StArrowWrapper onClick={clickRight}>
                <Image src={rightArrow} width='20px' height='20px' alt='오른쪽 화살표'/>
            </StArrowWrapper>


        </StWrapper>
    );
};

export default Slider;

const StWrapper=styled.div`
display: flex;
align-items: center;
/* background-color: yellow; */
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

const StArrowWrapper = styled.div`
padding-left: 7.5rem; 
/* background-color: pink; */

img{
    
}

    
`