import React,{useState} from 'react';
import styled from 'styled-components';
import Track from './Track';
import Slider from './Slider';
import Arrow from './Arrow';
import Slick from './Slick';

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

        
        let slidesDivide = dividePerWidth();

        //슬라이더에 3개씩 보이게
        //슬라이더 회전 수 = rotation
        //if (총 슬라이드 수/3 = 0) => {rotation=총 슬라이드 수 % 3},  
        // else => {rotation = 총 슬라이드 수 % 3}
        function dividePerWidth(){
            const length = trackData.length;
            let slidesPerRow = 3;
            
            //map 돌릴 배열
            let slicedArr=[];
            let rotation = length/slidesPerRow;
            let remain = length%slidesPerRow;
            var i=0;
            var n=0;
            var pushArr=[]

            //데이터 복제 필요 없음 
            //rotation = 총 게시물 수 / 한 슬라이더에 보여줄 슬라이드 수 ... 로 딱 나누어 떨어짐
            if (length/slidesPerRow===0){
                rotation = length/3;
                
                while (i<rotation){
                    pushArr = trackData.slice(i, i+slidesPerRow+1);
                    // slicedArr.push(pushArr[i]);

                    while(n<slidesPerRow){
                        slicedArr.push(pushArr[n]);
                        n++;
                    }
                    i++;
                }

            }

            //슬라이더에 부족한 수만큼 복제
            //ex) 게시물 개수 8개인 경우-> rotation=> 2회(3개,3개) 1회(2개)
            //ex) 게시물 개수 13개인 경우-> rotation=> 4회(3개,3개,3,3) 1회(1개)
            else{
                rotation = length/3 + 1;
                console.log('딱 떨어지지않을때')

                while (i<rotation){
                    pushArr = trackData.slice(i,i+slidesPerRow+1);
                    console.log(pushArr);
                    // slicedArr.push(pushArr[i]);

                    while(n<slidesPerRow){
                        slicedArr.push(pushArr[n]);
                        n++;
                        
                    }
                    i++;
                }

                //배열 복제 코드
                while (i<remain){
                slicedArr.push(trackData[i]);
                i++;
                }
            }

            return[...slicedArr];
        }


    
        const transitionTime = 500;
        const transitionStyle = `transform ${transitionTime}ms ease 0s`;
        

        
        const [transition, setTransition] = useState('1s');
        function handleSwipe(direction:number){

            if (translateVal===slides.length-cloneDataNum) {
                
            };


            handleSlide(currentIdx+direction);
        }
    
    return (
        <>

        <StWrapper>
            <Track track={trackName} trackData={trackData} />

            <StSlideWrapper>
                <Arrow direction='left' />
                {/* <Slider
                    translateVal={translateVal}
                    trackData={trackData}
                    trackNum={trackNum}
                    cloneData={slidesDivide}
                    cloneDataNum={cloneDataNum}
                    transition={transition}/> */}

                <Slick
                    trackData={trackData}
                    trackName={trackName}
                    />
                    
                <Arrow direction='right' />

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





