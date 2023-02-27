import styled from 'styled-components';

import AttendanceChecker from './AttendanceChecker';

import { ITrackController } from './componentType';

interface IProps {
  track: ITrackController;
  trackData: string[];
}

const TrackAttendance = ({ track, trackData }: IProps) => {
  const attendanceCheckerNumberArray = Array.from({ length: track.arrayLength }, (_, index) => index + 1);
  const getDisplayData = (number: number) => (trackData[number] ? trackData[number] : number);

  return (
    <Wrapper>
      <TitleWrapper>
        <TrackTitle color={track.titleColor}>{track.title}</TrackTitle>
      </TitleWrapper>
      <AttendanceCheckWrapper>
        {attendanceCheckerNumberArray.map((number) => (
          <AttendanceChecker
            key={number}
            color={track.titleColor}
            type={track.title}
            displayData={getDisplayData(number)}
          />
        ))}
      </AttendanceCheckWrapper>
    </Wrapper>
  );
};

export default TrackAttendance;
const Wrapper = styled.div`
  display: flex;
  margin: 30px 0;
`;
const TrackTitle = styled.div`
  font-family: 'Pretendard';
  font-weight: 900;
  font-size: 1.7rem;
  color: ${(props) => props.color};
  @media (max-width: 900px) {
    font-size: 1rem;
  }
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
