import { BackgroundColor, Primary } from '@utils/constant/color';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MakeAttendanceButton from './MakeAttendanceButton';

interface UserProps {
  isAdmin: boolean;
  name?: string;
}

const ScoreHeader = ({ isAdmin, name }: UserProps) => {
  const [isPre, setIsPre] = useState<boolean>(false);

  useEffect(() => {
    if (name === '박연우' || name === '조하정') {
      setIsPre(true);
    }
  }, [name]);

  return (
    <>
      <TitleHeader>
        <TitleText>출석현황</TitleText>
        {isPre && <MakeAttendanceButton />}
      </TitleHeader>

      <CallOut>
        <Row>
          <span>기본 점수</span> 3점
        </Row>
        <Row>
          <span>지각(5분)</span> -0.5점
        </Row>
        <Row>
          <span>무단결석</span> -1.5점
        </Row>
        <Row>
          <span>결석</span> - 1점
        </Row>
        <Row>
          <span>과제 미제출</span> - 1점{' '}
        </Row>
        <Row>
          <span>추후 제출 시</span> + 0.8점
        </Row>
      </CallOut>
    </>
  );
};

export default ScoreHeader;

const TitleText = styled.div`
  font-family: 'Gmarket Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 1.7rem;
`;

const TitleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
`;

const CallOut = styled.div`
  font-size: 1.3rem;
  display: flex;
  flex-wrap: wrap;
  background-color: ${Primary.light};
  padding: 2rem;
  border-radius: 0.5rem;
  justify-content: justify-content;
  gap: 6px;
  align-items: center;
  margin: 1rem 0;
  font-family: 'Pretendard';
  font-style: normal;
`;

const Row = styled.div`
  display: flex;
  & > span {
    font-weight: 800;
  }
  gap: 10px;
  background-color: ${BackgroundColor};
  padding: 0.5rem 1rem;
  border-radius: 10px;
`;
