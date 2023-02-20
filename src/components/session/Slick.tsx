import React from 'react';
import Slider from 'react-slick';

import Arrow from './Arrow';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styled from 'styled-components';
import Card from '@archiving/Card';

type  ModalProps = {
    trackName: string;
    trackData: { id: number; title: string, category:string, thumbnail:string}[];
};


const Slick:React.FC<ModalProps> = ({trackData, trackName}) => {
    const settings={
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 4,
        arrows: true,
        // prevArrow:(<Arrow direction='left' />),
        // nextArrow:(<Arrow direction='right' />)

    }


    return (
        <Wrapper>
            
            <StSlider {...settings} className='cardWrapper'>
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
    background-color: red;
    width: 7rem;
    height: 7rem;
    cursor: pointer;
    padding: 0;
    display: block;
    color: transparent;
    border: none;
    outline: none;
    background: transparent;

}

.slick-prev{
    margin-left: -3rem;
}

.slick-next{
    margin-right:-3rem;
}
`

