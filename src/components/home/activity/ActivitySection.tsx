import React from 'react';
import styled from 'styled-components';
import QuestionLion from '@image/가치_물음표 사자.gif';
import Image from 'next/image';
import { Primary } from '@utils/constant/color';
import FadeInComponent from '@home/common/FadeInComponent';
import TrackDescriptionBox from '@home/track/component/TrackDescriptionBox';
import ActivityDescriptionBox from './component/ActivityDescriptionBox';
import { useState } from 'react';
import ActivityButton from './component/ActivityButton';
import activityimg from '@image/활동기록보러가기.png';
import { ACTIVITY_DESCRIPTION, ACTIVITY_NAME } from '@utils/constant';

const ActivitySection = () => {

  const [isClicked, setIsClicked] = useState([true, false, false, false, false]);
  const activity = isClicked.indexOf(true);

  const handleClickActivityButton = (i: number) => {
    const copy: boolean[] = [false, false, false, false, false];
    copy[i] = true;
    setIsClicked(copy);
  };

  return (
    <FadeInComponent>
      <Wrapper>
        <RowWrapper>
          <ImageWrapper>
            <Image
              src={QuestionLion}
              width={'372px'}
              height={'372px'}
              layout="fill"
              objectFit="fill"
              objectPosition="center"
              alt="소개하는 사자"
            />
          </ImageWrapper>
          <TitleText>중앙대 멋사의 다양한 활동</TitleText>
        </RowWrapper>
        <ActivityWrapper>
          <CenterWrapper>
            <ButtonsWrapper>
              {isClicked.map((track, i: number) => (
                <ActivityButton
                  key={i}
                  title={ACTIVITY_NAME[i]}
                  isClicked={track}
                  handleClickActivityButton={() => handleClickActivityButton(i)}
                />
              ))}
            </ButtonsWrapper>
          </CenterWrapper>
          <DescriptionWrapper>
            <ActivityImageWrapper>
              <Image src={activityimg} width={550} height={380} alt="활동사진" style={{ 'borderRadius': '20px' }} />
            </ActivityImageWrapper>
            <ActivityDescriptionBox text={ACTIVITY_DESCRIPTION[activity].description} />
          </DescriptionWrapper>
        </ActivityWrapper>
      </Wrapper>
    </FadeInComponent>
  );
};

export default ActivitySection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  @media(min-width: 900px){
    scroll-snap-align: start;
    min-height: 100vh;
    height: 100%;
  }
`;


const TitleText = styled.div`
  display: flex;
  justify-content: flex-start;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 3.7rem;
  line-height: 4rem;
  margin: 2.5rem 0;

  @media (max-width: 1550px) {
    font-size: 3rem;
  }

  @media(max-width: 900px){
    justify-content: center;
  }
`;



const ImageWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const ActivityImageWrapper = styled.div`
  position: relative;
  width: 550px;
  border-radius: 20px;
  overflow: hidden;
  max-width: 90%;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 4rem;
  margin-top: 30px;
  @media(max-width: 900px){
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media(max-width: 900px){
    width: 100%;
    justify-content: space-around;
  }
  width: 80%;
`;
const CenterWrapper = styled.div`
  width: 100%;
  margin: 3rem 0;
  display: flex;
  justify-content: center;
`;

const ActivityWrapper = styled.div`
  width: 100%;
`;

const RowWrapper = styled.div`
  margin-top: 80px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 3rem;
`;

