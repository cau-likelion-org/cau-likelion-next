import styled from 'styled-components';

import EntireTrackAttendance from './component/EntireTrackAttendance';

const CompletedSection = () => {
  return (
    <Wrapper>
      <SubTitle>출석체크</SubTitle>
      <Title>오늘의 출석부</Title>
      <EntireTrackAttendance />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  margin-top: 100px;
  @media (max-width: 1440px) {
    padding: 0 250px;
  }
  @media (max-width: 1280px) {
    padding: 0 150px;
  }
<<<<<<< HEAD
  @media (max-width: 900px) {
    padding: 0 45px;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  padding: 0 360px;
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 2.3rem;
`;
const SubTitle = styled.div`
  font-family: 'Inter';
  font-weight: 400;
  font-size: 1.7rem;
`;
export default CompletedSection;
