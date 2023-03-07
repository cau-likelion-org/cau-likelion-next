import React from 'react';
import styled from 'styled-components';
import Card from '@archiving/Card';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ISessionData } from '@@types/request';

type ModalProps = {
    trackName: string;
    trackData: ISessionData[];
};


const Slick: React.FC<ModalProps> = ({ trackData, trackName }) => {

    const settings = {
        infinite: true,
        speed: 1000,
        swipeToSlide: true,
        touchMove: true,
        variableWidth: true,

        responsive: [
            {
                breakpoint: 900,
                settings: {
                    variableWidth: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    variableWidth: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    };

    return (
        <Wrapper>
            <>
                <StSlider  {...settings}>
                    {trackData.slice(0).reverse().map((data) => {
                        return (
                            <Card
                                key={data.id}
                                id={data.id}
                                link='/session'
                                // thumbnail={data.thumbnail}
                                thumbnail={'https://cau-likelion.s3.ap-northeast-2.amazonaws.com/project-img/9%E1%84%80%E1%85%B5/Rectangle_336-1.png'}
                                title={data.title}
                                category={`${data.degree}차 세션`} />
                        );
                    })}
                </StSlider>
            </>
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
display: flex;
justify-content: center;
align-items: center;
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

.slick-prev{ margin-left: -3rem; }

.slick-next{ margin-right: -3rem;}

.slick-slide { padding: 40px 30px;}

@media (min-width: 821px) and (max-width: 900px) {
    height: 33rem;
}

@media (min-width: 360px) and (max-width: 820px) {
    height: 30rem;
}

`;