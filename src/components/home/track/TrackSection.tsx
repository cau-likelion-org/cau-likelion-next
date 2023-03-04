import { useState } from 'react';
import styled from 'styled-components';

import { TRACK_DESCRIPTION, TRACK_NAME } from '@utils/constant';

import TrackButton from './component/TrackButton';
import TrackDescriptionBox from './component/TrackDescriptionBox';
import FadeInComponent from '@home/common/FadeInComponent';

const TrackSection = () => {
  const [isClicked, setIsClicked] = useState([true, false, false, false]);
  const track = isClicked.indexOf(true);

  const handleClickTrackButton = (i: number) => {
    const copy: boolean[] = [false, false, false, false];
    copy[i] = true;
    setIsClicked(copy);
  };
  const text =
    '기획, 디자인, 프론트엔드, 백엔드 트랙으로 나뉘어 개별 세션, 스터디가 진행됩니다.\n각 트랙의 세부 활동에 대해 알아볼까요?';
  return (
    <FadeInComponent>
      <Wrapper>
        <TitleText>트랙 소개</TitleText>
        <Text>{text}</Text>
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
    </FadeInComponent>
  );
};

export default TrackSection;

const Wrapper = styled.div`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TitleText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'GmarketSans';
  font-style: normal;
  font-weight: 900;
  font-size: 3.7rem;
  width: 100%;
  text-align: center;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 1.5rem;
  @media (max-width: 1376px) {
    font-size: 2.5rem;
  }
`;

const Text = styled.div`
  font-family: 'GmarketSans';
  font-weight: 500;
  line-height: 2.5rem;
  font-size: 1.7rem;
  padding: 0.8rem 0;
  text-align: center;
  white-space: pre-wrap;
  @media (max-width: 900px) {
    text-align: left;
    white-space: normal;
  }
`;
const TrackWrapper = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 900px) {
    width: 100%;
    justify-content: space-around;
  }
  width: 80%;
  gap: 3rem;
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
