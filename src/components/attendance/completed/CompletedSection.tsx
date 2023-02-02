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
  padding: 10rem 35rem;
  @media (max-width: 1660px) {
    padding: 100px 200px 100px 200px;
  }
  @media (max-width: 1440px) {
    padding: 100px 150px 100px 150px;
  }
  @media (max-width: 1280px) {
    padding: 100px 120px 100px 120px;
  }
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 4rem;
`;
const SubTitle = styled.div`
  font-family: 'Inter';
  font-weight: 400;
  font-size: 2rem;
`;
export default CompletedSection;
