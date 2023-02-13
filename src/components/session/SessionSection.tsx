import React,{useState} from 'react';
import styled from 'styled-components';
import Track from './Track';
import Slider from './Slider';
import Arrow from './Arrow';

type  SessionProps = {
    trackName: string;
    trackData: { id: number; title: string, category:string, thumbnail:string}[];
    trackNum: number,
};


const SessionSection:React.FC<SessionProps> =({trackName, trackNum, trackData}) => {
    const [translateVal, setTranslateVal] = useState<number>(0);

    const moveRight = (): void => {
        if (translateVal !== 70 * (trackData.length - 1)) {
            setTranslateVal((prev) => prev + 70);
        } 
        else {setTranslateVal(0);}
    };

    const moveLeft = (): void => {
        if (translateVal !== 0) {
            setTranslateVal((prev) => prev - 70);
        } 
        else {setTranslateVal(70 * (trackData.length - 1));}
    };

    const clickRight = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveRight();
    };

    const clickLeft = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveLeft();
    };


    
    return (
        <StWrapper>
            <Track track={trackName} />

            <StSliderRowWrapper>

                <div onClick={clickLeft}><Arrow direction='left' /></div>
                <StSliderWrapper>
                        <Slider
                        translateVal={translateVal}
                        trackData={trackData}
                        trackNum={trackNum}
                        />
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


const StSliderRowWrapper = styled.div`
display: flex;
align-items: center;
`




