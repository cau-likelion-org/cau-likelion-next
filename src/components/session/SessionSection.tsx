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
            setTranslateVal((prev) => prev + 35);
        } 
        else {setTranslateVal(0);}
    };

    const moveLeft = (): void => {
        if (translateVal !== 0) {
            setTranslateVal((prev) => prev - 35);
        } 
        else {setTranslateVal(70 * (trackData.length - 1));}
    };

    const clickRight = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveRight();
    };

    const clickLeft = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        moveLeft();
    };



    //무한슬라이드 구현
    const [currentIdx, setCurrentIdx] = useState(0);
    const length = trackData.length;


    function handleSlide(idx: number){
        if (idx<0) { idx = length-1; } 
        else if (idx > length) {idx = 0 }

        setCurrentIdx(idx);
        setTranslateVal(currentIdx);
    }


        const Arr:{id: number; title: string, category:string, thumbnail:string}[]=[];
        let slides = setSlides();
    
        function getArr(){
            {trackData.map((data)=>{
                Arr.push(data)
            })}
    
            return Arr;
        }
        // console.log(Arr);
    
        //끝에 도달했을 때 한바퀴 도는 것 처럼 보이게 하기 위해 
        //데이터를 복제하여 만든 배열 return
        function setSlides() {
            let addFront = [];
            let addLast = [];
            var index = 0;
            let images = getArr();
            let length = images.length;
    
            while (index < 3) {
                addLast.push(images[index%length]);
                addFront.unshift(images[length-1-(index%length)]);
                index++;
            }
    
            // return[...images];
            return[...addFront, ...images, ...addLast];
        }

        // console.log(setSlides());
    
        function getArrIndex(idx:number){
            idx -= 3;
            if (idx<0) {idx += length;}
            else if (idx>=length) {idx -= length}
    
            return idx;
        }
    
        const transitionTime = 500;
        const transitionStyle = `transform ${transitionTime}ms ease 0s`;
        const [StTransition, setTransition] = useState('');
    
        function replaceSlide(idx:number){
            setTimeout(()=>{
                setTransition('');
                setCurrentIdx(idx);
            },transitionTime)}

        

        function handleSwipe(direction:number){
            // let idx = currentIdx+direction;
            // setCurrentIdx(idx);
            // if(idx<3){
            //     idx += length;
            //     replaceSlide(idx);
            //     setTranslateVal(currentIdx);
            // }
            // else if (idx >= length + 3){
            //     idx -= length;
            //     replaceSlide(idx);
            //     setTranslateVal(currentIdx);
            // }
            // setTransition(transitionStyle);

            // console.log(translateVal);

            handleSlide(currentIdx+direction);
        }
    


    return (
        <StWrapper>
            <Track track={trackName} trackData={trackData} />

            <StSliderRowWrapper>

                <div onClick={() => handleSwipe(-1)}><Arrow direction='left' /></div>
                    <Slider
                    translateVal={translateVal}
                    trackData={trackData}
                    trackNum={trackNum}
                    sessionImg={slides}
                    />
                <div onClick={() => handleSwipe(1)}><Arrow direction='right' /></div>

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

const StSliderRowWrapper = styled.div`
display: flex;
align-items: center;
`




