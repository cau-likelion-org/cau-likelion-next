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

    //무한슬라이드 구현
    const [currentIdx, setCurrentIdx] = useState(0);
    const cloneDataNum=4;

    const length = trackData.length;


    function handleSlide(idx: number){
        if (idx < 0) { idx = length-1; } 
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
    
        //끝에 도달했을 때 한바퀴 도는 것 처럼 보이게 하기 위해 
        //데이터를 복제하여 만든 배열 return
        function setSlides() {
            let addFront = [];
            let addLast = [];
            var index = 0;
            let images = getArr();
            let length = images.length;
    
            while (index < cloneDataNum ) {
                addLast.push(images[index%length]);
                addFront.unshift(images[length-1-(index%length)]);
                index++;
            }
    
            return[...addFront, ...images];
        }
    
        const transitionTime = 500;
        const transitionStyle = `transform ${transitionTime}ms ease 0s`;
        

        
        const [transition, setTransition] = useState('1s');
        function handleSwipe(direction:number){
            // if (translateVal === slides.length-3){
            //     setTimeout(()=>{
            //         setTransition('');
            //         setTranslateVal(0);

            //     },1000)
            // }
            // else {setTransition('1s')};


            handleSlide(currentIdx+direction);
        }
    
    return (
        <>

        <StWrapper>
            <Track track={trackName} trackData={trackData} />

            <StSlideWrapper>
                <div onClick={() => handleSwipe(-1)}><Arrow direction='left' /></div>
                <Slider
                    translateVal={translateVal}
                    trackData={trackData}
                    trackNum={trackNum}
                    cloneData={slides}
                    cloneDataNum={cloneDataNum}
                    transition={transition}/>
                    
                <div onClick={() => handleSwipe(1)}><Arrow direction='right' /></div>

            </StSlideWrapper>

        </StWrapper>
        </>
    );
}
export default SessionSection;

const StWrapper= styled.div`
display: flex;
flex-direction: column;

align-items: center;
font-family: 'Pretendard';
font-style: normal;
font-weight: 900;
font-size: 4rem;
width: 100%;

@media (max-width: 1550px) {
        font-size: 2.3rem;
    }

`

const StSlideWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    
`





