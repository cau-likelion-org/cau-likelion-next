import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Track from './Track';
import Arrow from './Arrow';
import { ISessionData } from '@@types/request';
import Card from '@archiving/Card';

type SessionProps = {
  trackName: string;
  trackData: ISessionData[];
};

const SessionSection = ({ trackName, trackData }: SessionProps) => {
  const [cardWidth, setCardWidth] = useState(0);
  const [cycleWidth, setCycleWidth] = useState(0);
  const [cycleNum, setCycleNum] = useState(0);
  const [counter, setCounter] = useState(0);
  const cardNum = trackData.length;

  useEffect(() => {
    const containerWidth = window.innerWidth * 0.76 - 50;
    if (window.innerWidth >= 1920) {
      setCardWidth(400);
    }
    else if (window.innerWidth >= 900 && window.innerWidth < 1920) {
      setCardWidth(350);
    }
    else if (window.innerWidth >= 660 && window.innerWidth < 900) {
      setCardWidth(320);
    }
    else if (window.innerWidth >= 445 && window.innerWidth < 660) {
      setCardWidth(260);
    }
    else if (window.innerWidth >= 330 && window.innerWidth < 445) {
      setCardWidth(200);
    }
    else {
      setCardWidth(150);
    }
    setCycleWidth(Math.floor(containerWidth / cardWidth) * cardWidth);
    setCycleNum(Math.ceil(cardWidth * cardNum / cycleWidth));

  }, [cardWidth, cycleWidth, cardNum]);

  const leftBtnClickHandler = () => {
    setCounter(counter > 0 ? counter - 1 : cycleNum - 1);
  };

  const rightBtnClickHandler = () => {
    setCounter(counter + 1 < cycleNum ? counter + 1 : 0);
  };

  return (
    <>
      {
        cardNum ? (
          <StWrapper>
            <Track track={trackName} trackData={trackData} />
            <StSlideWrapper>
              <Arrow direction="left" cycleNum={cycleNum} onClick={leftBtnClickHandler} />
              <HiddenLayer>
                <CardWrapper counter={counter} cycleWidth={cycleWidth} cycleNum={cycleNum}>
                  {trackData.map((data, i) => (
                    <Card
                      key={data.id}
                      id={data.id}
                      link="/session"
                      thumbnail={data.thumbnail}
                      title={data.title}
                      category={`${data.degree}차 세션`} />
                  ))}
                </CardWrapper>
              </HiddenLayer>
              <Arrow direction="right" onClick={rightBtnClickHandler} cycleNum={cycleNum} />
            </StSlideWrapper>
          </StWrapper>
        ) : null
      }
    </>
  );
};
export default SessionSection;

const StWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 4rem;
  overflow-x: hidden;

  @media (max-width: 1550px) {
    font-size: 2.3rem;
  }
    @media (min-width: 1920px) {
    min-height: 420px;
  }

  @media (min-width: 901px) and (max-width: 1919px) {
    min-height: 390px;
  }

  @media (min-width: 661px) and (max-width: 900px) {
    min-height: 320px;
  }

  @media (min-width: 445px) and (max-width: 660px) {
    min-height: 290px;
  }

  @media (min-width: 330px) and (max-width: 444px) {
    min-height: 260px;
  }
`;

const StSlideWrapper = styled.div`
  display: flex;
  width: 76vw;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  gap: 10px;
`;

const CardWrapper = styled.div<{ counter: number; cycleWidth: number; cycleNum: number; }>`
  transform: ${props => `translateX(${-props.counter * props.cycleWidth}px)`};
  transition: ease-in 0.4s;
  display: flex;
`;

const HiddenLayer = styled.div`
  display: flex;
  overflow-x: hidden;
  width: 100%;
`;

