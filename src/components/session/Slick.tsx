import React from 'react';
import styled from 'styled-components';
import Card from '@archiving/Card';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type  ModalProps = {
    trackName: string;
    trackData: { id: number; title: string, category:string, thumbnail:string}[];
};


const Slick:React.FC<ModalProps> = ({trackData, trackName}) => {
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


    const settings={
        infinite: true,
        speed: 1000,
        variableWidth: true,
        swipeToSlide: true,
        touchMove: true,

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
                    slidesToShow: slidesToShowArr[3],
                    slidesToScroll:slidesToShowArr[3],
            }},
            {breakpoint:600,
                settings:{
                    slidesToShow: slidesToShowArr[3],
                    slidesToScroll:slidesToShowArr[3],
            }},]}

    return (
        <Wrapper>
            <StSlider  {...settings}>
                {trackData.slice(0).reverse().map((data)=>{
                    return(
                        <Card
                        key={data.id}
                        id= {data.id}
                        link='/session'
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
height: 45rem;

.slick-prev,
.slick-next {
    width: 7rem;
    height: 7rem;
    padding: 0;
    display: block;
    z-index: 1;
    opacity: 0%;
    cursor: pointer;

}

.slick-prev{ margin-left: -3rem;}

.slick-next{ margin-right: -3rem;}

.slick-slide { padding: 40px 30px;}

`
