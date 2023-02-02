import { MemberStack, MemberStackKor } from '@@types/request';
import React from 'react';
import styled from 'styled-components';
import AttendanceChecker from './AttendanceChecker';
import { Primary, Secondary } from '@utils/constant/color';
interface IPropsController {
  title: MemberStackKor;
  arrayLength: number;
  titleColor: string;
  color: string;
}
interface IProps {
  track: MemberStack;
  trackData: string[];
}

const PropsController: Record<MemberStack, IPropsController> = {
  pm: {
    title: '기획',
    arrayLength: 6,
    color: Primary.light,
    titleColor: Primary.default,
  },
  design: {
    title: '디자인',
    arrayLength: 6,
    color: '#FFF2EB',
    titleColor: Secondary.default,
  },
  frontend: {
    title: '프론트엔드',
    arrayLength: 12,
    color: '#ECFDE8',
    titleColor: '#36CA60',
  },
  backend: {
    title: '백엔드',
    arrayLength: 12,
    color: '#FDF3FF',
    titleColor: '#F33EA0',
  },
};

const Track = ({ track, trackData }: IProps) => {
  const attendanceCheckerNumberArray = Array.from(
    { length: PropsController[track].arrayLength },
    (value, index) => index + 1,
  );

  return (
    <Wrapper>
      <TitleWrapper>
        <TrackTitle color={PropsController[track].titleColor}>{PropsController[track].title}</TrackTitle>
      </TitleWrapper>
      <AttendanceCheckWrapper>
        {attendanceCheckerNumberArray.map((number) => (
          <AttendanceChecker
            key={number}
            color={PropsController[track].titleColor}
            type={PropsController[track].title}
            number={number}
            userData={trackData}
          />
        ))}
      </AttendanceCheckWrapper>
    </Wrapper>
  );
};

export default Track;
const Wrapper = styled.div`
  display: flex;
  margin: 30px 0;
`;
const TrackTitle = styled.div`
  font-family: 'Pretendard';
  font-weight: 900;
  font-size: 1.7rem;
  color: ${(props) => props.color};
`;
const AttendanceCheckWrapper = styled.div`
  flex-basis: 90%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;
const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-basis: 10%;
  margin-top: 42px;
`;
