import { UserAttendance, UserScore } from '@@types/request';
import { ATTENDANCE_CATEGORY_NAME, TRACK_NAME } from '@utils/constant';
import { BackgroundColor, GreyScale } from '@utils/constant/color';
import { getTotalNameObject, getTotalScore } from '@utils/index';
import { token, userScoreChanged } from '@utils/state';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getAssignments, getTotalAttendance } from 'src/apis/mypage';
import styled from 'styled-components';
import ScoreEditModal from './component/ScoreEditModal';
import ScoreHeader from './component/ScoreHeader';
import { TiPencil } from 'react-icons/ti';

const TotalScoreSection = ({ myName }: { myName: string }) => {
  const tokenValue = useRecoilValue(token);
  const [totalScoreArray, setTotalScoreArray] = useState<UserScore[]>([]);
  const [isEditModalOn, setIsEditModalOn] = useState(false);
  const [clickedUser, setClickedUser] = useState<UserScore>({} as UserScore);
  const scoreChanged = useRecoilValue(userScoreChanged);
  const [isPre, setIsPre] = useState<boolean>(false);
  const [sortScoreArray, setSortScoreArray] = useState<UserScore[]>([]);

  useEffect(() => {
    if (myName === '최재영' || myName === '박재윤') {
      setIsPre(true);
    }
  }, [myName]);

  const handleScoreEditModal = (userScore: UserScore) => {
    setIsEditModalOn(!isEditModalOn);
    setClickedUser(userScore);
  };

  const {
    data: totalAssignment,
    isLoading: totalAssignmentLoading,
    error: totalAssignmentError,
  } = useQuery(['userAssignment'], getAssignments);

  const {
    data: totalAttendance,
    isLoading: totalAttendanceLoading,
    error: totalAttendanceError,
  } = useQuery(['userAttendance', scoreChanged], () => getTotalAttendance(tokenValue));

  useEffect(() => {
    if (totalAttendance && totalAssignment) {
      const tmpObject = getTotalNameObject(totalAssignment);
      totalAttendance.length &&
        totalAttendance.forEach((userAttendance: UserAttendance, i: number) => {
          const target = tmpObject[userAttendance.name];

          if (target?.track === userAttendance?.track) {
            target.user_id = userAttendance.user_id;
            target.tardiness = userAttendance.tardiness;
            target.truancy = userAttendance.truancy;
            target.absence = userAttendance.absence;
            target.totalScore = getTotalScore(target);
          }
        });
      setTotalScoreArray(Object.values(tmpObject));
      const sort = totalScoreArray.sort((a: UserScore, b: UserScore) => {
        if (a.track !== b.track) {
          return a.track - b.track;
        }
        return a.name.localeCompare(b.name, 'ko');
      });
      setSortScoreArray(sort);
    }
  }, [totalAssignment, totalAttendance, totalScoreArray]);

  return (
    <>
      <Wrapper>
        <ScoreHeader isAdmin={true} name={myName} />
        <ScoreWrapper>
          {!totalAssignmentLoading && !totalAttendanceLoading && (
            <>
              <ScoreRow index={0}>
                <ScoreTitle index={0}>이름</ScoreTitle>
                <ScoreTitle index={1}>트랙</ScoreTitle>
                {Array.from({ length: 6 }, (_, i) => (
                  <ScoreTitle index={i + 2} key={i}>
                    {ATTENDANCE_CATEGORY_NAME[i]}
                  </ScoreTitle>
                ))}
              </ScoreRow>
              {sortScoreArray.map((userScore, i) => (
                <ScoreRow index={i + 1} key={i}>
                  <Score>
                    {userScore.name}
                    {isPre && <EditButton onClick={() => handleScoreEditModal(userScore)} />}
                  </Score>
                  <Score>{TRACK_NAME[userScore?.track]}</Score>
                  <Score>{userScore.absence}</Score>
                  <Score>{userScore.truancy}</Score>
                  <Score>{userScore.tardiness}</Score>
                  <Score>{userScore.notSubmitted}</Score>
                  <Score>{userScore.lateSubmitted}</Score>
                  <Score type={'total'}>{userScore.totalScore}</Score>
                </ScoreRow>
              ))}
            </>
          )}
        </ScoreWrapper>
      </Wrapper>
      {isEditModalOn ? (
        <ScoreEditModal
          targetUserScore={clickedUser}
          isEditModalOn={isEditModalOn}
          handleScoreEditModal={handleScoreEditModal}
        />
      ) : null}
    </>
  );
};
export default TotalScoreSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScoreWrapper = styled.div`
  margin: 3rem 0;
  width: 100%;
  min-height: 86px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid #bbbbbb;
  justify-content: space-between;
  overflow: hidden;
`;

const ScoreRow = styled.div<{ index: number }>`
  display: flex;
  width: 100%;
  background-color: ${(props) => (props.index % 2 == 0 ? GreyScale.light : BackgroundColor)};
`;

const ScoreTitle = styled.div<{ index: number }>`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  padding: 1rem 0;
  font-size: 1.4rem;
  flex-basis: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: ${(props) => (props.index == 7 ? 'none' : '1px solid gray')};
`;

const Score = styled.div<{ type?: string }>`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.4rem;
  padding: 0.8rem 0;
  flex-basis: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: ${(props) => (props.type == 'total' ? 'none' : '1px solid gray')};
`;

const EditButton = styled(TiPencil)`
  cursor: pointer;
  margin-left: 2px;
`;
