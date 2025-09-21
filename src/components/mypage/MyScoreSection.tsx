import { UserAttendance, UserProfile } from '@@types/request';
import { ATTENDANCE_CATEGORY_NAME } from '@utils/constant';
import { GreyScale } from '@utils/constant/color';
import { getTotalScore } from '@utils/index';
import { token } from '@utils/state';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getAssignments } from 'src/apis/mypage';
import styled from 'styled-components';
import ScoreHeader from './component/ScoreHeader';
import useUserAttendance from 'src/apis/queries/useUserAttendance';

const MyScoreSection = ({ userProfile }: { userProfile: UserProfile }) => {
  const [totalScore, setTotalScore] = useState<number>(0);

  const { userAttendance } = useUserAttendance();

  const {
    data: userAssignment,
    isLoading: assignmentLoading,
    error: assignmentError,
  } = useQuery(
    ['userAssignment'],
    () => getAssignments().then((data) => data.filter((user: any) => user['이름'] == userProfile!.name)),
    {
      enabled: !!userProfile,
    },
  );

  useEffect(() => {
    if (userAttendance && userAssignment) {
      const score = getTotalScore({
        absence: userAttendance.absence,
        truancy: userAttendance.truancy,
        tardiness: userAttendance.tardiness,
        notSubmitted: userAssignment[0]['과제 미제출'],
        lateSubmitted: userAssignment[0]['과제 지각제출'],
      });
      setTotalScore(score);
    }
  }, [userAssignment, userAttendance]);

  return (
    <Wrapper>
      <ScoreHeader isAdmin={false} />
      <ScoreWrapper>
        {userAttendance && userAssignment && (
          <>
            <ScoreRow>
              {Array.from({ length: 6 }, (_, i) => (
                <ScoreTitle index={i} key={i}>
                  {ATTENDANCE_CATEGORY_NAME[i]}
                </ScoreTitle>
              ))}
            </ScoreRow>
            <ScoreRow>
              <Score>{userAttendance.absence}</Score>
              <Score>{userAttendance.truancy}</Score>
              <Score>{userAttendance.tardiness}</Score>
              <Score>{userAssignment[0]['과제 미제출']}</Score>
              <Score>{userAssignment[0]['과제 지각제출']}</Score>
              <Score type={'total'}>{totalScore}</Score>
            </ScoreRow>
          </>
        )}
      </ScoreWrapper>
    </Wrapper>
  );
};

export default MyScoreSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScoreWrapper = styled.div`
  margin: 3rem 0;
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid #bbbbbb;
  justify-content: space-between;
  overflow: hidden;
`;

const ScoreRow = styled.div`
  display: flex;
  width: 100%;
`;

const ScoreTitle = styled.div<{ index: number }>`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.4rem;
  flex-basis: 50%;
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${GreyScale.light};
  border-right: ${(props) => (props.index == 5 ? 'none' : '1px solid gray')};
`;

const Score = styled.div<{ type?: string }>`
  font-family: 'Pretendard';
  padding: 0.8rem 0;
  font-style: normal;
  font-weight: 500;
  font-size: 1.4rem;
  flex-basis: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fefefe;
  border-right: ${(props) => (props.type == 'total' ? 'none' : '1px solid gray')};
`;
