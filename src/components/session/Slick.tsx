import React from 'react';
import {useState} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styled from 'styled-components';
import Card from '@archiving/Card';

type  ModalProps = {
    trackName: string;
    trackData: { id: number; title: string, category:string, thumbnail:string}[];
};


const Slick:React.FC<ModalProps> = ({trackData, trackName}) => {
    const [active, setActive] = useState(1);
    const length = trackData.length;

    const slidesToShowArr = setSlidesToShow();

    function setSlidesToShow(){
        let arr=[]
        let i = 4;
        while(i>0){
            if(length<i){
                arr.push(length)
            }
            else{
                arr.push(i)
            }
            i--;
        }
        return[...arr];
    }
    
    console.log(slidesToShowArr);


    

    const settings1={
        infinite: true,
        speed: 1000,
        // variableWidth: true,
        // centerMode: true,

        responsive:[
            {breakpoint: 1920,
            settings:{
                slidesToShow: slidesToShowArr[0],
                slidesToScroll:slidesToShowArr[0],
            }},
            {breakpoint: 1660,
                settings:{
                    slidesToShow: slidesToShowArr[1],
                    slidesToScroll: slidesToShowArr[1],
            }},
            {breakpoint:1220,
                settings:{
                    slidesToShow: slidesToShowArr[2],
                    slidesToScroll:slidesToShowArr[2],
            }},
            {breakpoint:300,
                settings:{
                    slidesToShow:slidesToShowArr[3],
                    slidesToScroll:slidesToShowArr[3],
            }}

        ]
    }

    // @media (min-width: 1920px) {grid-template-columns: 1fr 1fr 1fr; gap: 20px;}

    // @media (min-width: 1220px) and (max-width: 1660px) {grid-template-columns: 1fr 1fr; gap: 30px;}

    // @media (min-width: 870px) and (max-width: 1221px) {grid-template-columns: 1fr 1fr; gap: 30px;;}

    // @media (min-width: 360px) and (max-width: 871px) {grid-template-columns: 1fr; gap: 30px;}



    return (
        <Wrapper>
            <StSlider  {...settings1} className='cardWrapper'>
                {trackData.slice(0).reverse().map((data)=>{
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
                    </StSlider>
            
        </Wrapper>
        
    );
};

export default Slick;

const Wrapper = styled.div`
margin: 0;
padding: 0;
width: 70vw;


`;


const StSlider = styled(Slider)`

.slick-prev,
.slick-next {
    width: 7rem;
    height: 7rem;
    cursor: pointer;
    padding: 0;
    display: block;
    color: transparent;
    border: none;
    outline: none;
    background: transparent;
    z-index: 1;

}

.slick-prev{
    margin-left: -3rem;
}

.slick-next{
    margin-right:-3rem;
}
`

