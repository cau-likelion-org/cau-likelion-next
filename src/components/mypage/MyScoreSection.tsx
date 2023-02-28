import { UserAttendance, UserProfile } from '@@types/request';
import { ATTENDANCE_CATEGORY_NAME } from '@utils/constant';
import { GreyScale } from '@utils/constant/color';
import { getTotalScore } from '@utils/index';
import { accessToken } from '@utils/state';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getAssignments, getUserAttendance } from 'src/apis/attendance';
import styled from 'styled-components';

const MyScoreSection = ({ userProfile }: { userProfile: UserProfile; }) => {

    const [totalScore, setTotalScore] = useState<number>(0);
    const tokenValue = useRecoilValue(accessToken);

    const { data: userAttendance, isLoading: attendanceLoading, error: attendanceError } = useQuery<UserAttendance, AxiosError>(
        ['userAttendance'],
        () => getUserAttendance(tokenValue)
    );

    const { data: userAssignment, isLoading: assignmentLoading, error: assignmentError } = useQuery(
        ['userAssignment'],
        () => getAssignments().then(res => res.data.filter((user: any) =>
            user['이름'] == userProfile!.name
        )),
        {
            enabled: !!userProfile
        }
    );

    useEffect(() => {
        if (userAttendance && userAssignment) {
            const score = getTotalScore({
                'absence': userAttendance.absence,
                'truancy': userAttendance.truancy,
                'tardiness': userAttendance.tardiness,
                'notSubmitted': userAssignment[0]['과제 미제출'],
                'lateSubmitted': userAssignment[0]['과제 지각제출']
            });
            setTotalScore(score);
        }
    }, [userAssignment, userAttendance]);

    return (
        <Wrapper>
            {userAttendance && userAssignment &&
                <>
                    <AttendanceRow>
                        {Array.from({ length: 6 }, (_, i) => (
                            <AttendanceTitle key={i}>{ATTENDANCE_CATEGORY_NAME[i]}</AttendanceTitle>
                        ))}
                    </AttendanceRow>
                    <AttendanceRow>
                        <AttendanceScore >{userAttendance.absence}</AttendanceScore>
                        <AttendanceScore >{userAttendance.truancy}</AttendanceScore>
                        <AttendanceScore >{userAttendance.tardiness}</AttendanceScore>
                        <AttendanceScore >{userAssignment[0]['과제 미제출']}</AttendanceScore>
                        <AttendanceScore >{userAssignment[0]['과제 지각제출']}</AttendanceScore>
                        <AttendanceScore>{totalScore}</AttendanceScore>
                    </AttendanceRow>
                </>
            }
        </Wrapper>
    );
};

export default MyScoreSection;


const Wrapper = styled.div`
    margin: 3rem 0;
    width: 100%;
    min-height: 86px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    border: 1px solid #BBBBBB;
    justify-content: space-between;
    overflow: hidden;
`;

const AttendanceRow = styled.div`
    display: flex;
    width: 100%;
    border-right: 1px solid gray;
`;

const AttendanceTitle = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    flex-basis: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${GreyScale.light};
`;

const AttendanceScore = styled(AttendanceTitle)`
    background-color: #FEFEFE;
`;