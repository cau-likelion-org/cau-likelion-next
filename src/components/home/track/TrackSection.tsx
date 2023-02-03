import { TRACK_DESCRIPTION, TRACK_NAME } from '@utils/constant';
import React, { useState } from 'react';
import styled from 'styled-components';
import TrackButton from './component/TrackButton';
import TrackDescriptionBox from './component/TrackDescriptionBox';

const TrackSection = () => {
  const [isClicked, setIsClicked] = useState([true, false, false, false]);
  const track = isClicked.indexOf(true);

  const handleClickTrackButton = (i: number) => {
    const copy: boolean[] = [false, false, false, false];
    copy[i] = true;
    setIsClicked(copy);
  };

  return (
    <Wrapper>
      <TitleText>트랙 소개</TitleText>
      <Text>멋사에서는 트랙을 나눠 각 트랙이 자신의 역량을 키우는 것을 돕습니다? 화이팅해서 어쩌구 저쩌구</Text>
      <TrackWrapper>
        <CenterWrapper>
          <ButtonsWrapper>
            {isClicked.map((track, i: number) => (
              <TrackButton
                key={i}
                title={TRACK_NAME[i]}
                isClicked={track}
                handleClickTrackButton={() => handleClickTrackButton(i)}
              />
            ))}
          </ButtonsWrapper>
        </CenterWrapper>
        <DescriptionWrapper>
          <TrackDescriptionBox
            type="introduction"
            title={`${TRACK_NAME[track]} 트랙은 어떤 것을 공부하나요?`}
            text={TRACK_DESCRIPTION[track].description}
          />
          <TrackDescriptionBox type="recommend" title="추천해요!" text={TRACK_DESCRIPTION[track].recommend} />
        </DescriptionWrapper>
      </TrackWrapper>
    </Wrapper>
  );
};

export default TrackSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  scroll-snap-align: start;
`;

const TitleText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 3.7rem;
  width: 100%;
  line-height: 76.51px;
  text-align: center;
  margin-left: 15px;
  margin-right: 15px;
`;

const Text = styled.div`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 17px;
  text-align: center;
  margin-top: 23px;
  margin-bottom: 70px;
`;
const TrackWrapper = styled.div`
  width: 100%;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
  gap: 30px;
`;
const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const DescriptionWrapper = styled.div`
  display: flex;
  gap: 27px;
  @media (max-width: 1200px) {
    flex-direction: column;
  }
  margin-top: 30px;
`;
