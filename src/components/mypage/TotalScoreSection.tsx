import { UserAssignment, UserAttendance, UserProfile, UserScore } from '@@types/request';
import { ATTENDANCE_CATEGORY_NAME, TRACK_NAME } from '@utils/constant';
import { GreyScale } from '@utils/constant/color';
import { getTotalNameObject, getTotalScore } from '@utils/index';
import { accessToken } from '@utils/state';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getAssignments, getTotalAttendance } from 'src/apis/attendance';
import styled from 'styled-components';

const TotalScoreSection = () => {
    const tokenValue = useRecoilValue(accessToken);
    const [totalScoreArray, setTotalScoreArray] = useState<UserScore[]>([]);
    const [totalScore, setTotalScore] = useState<number>(0);

    const { data: totalAssignment, isLoading: totalAssignmentLoading, error: totalAssignmentError } = useQuery(
        ['userAssignment'], () => getAssignments().then(res => res.data)
    );

    const { data: totalAttendance, isLoading: totalAttendanceLoading, error: totalAttendanceError } = useQuery(
        ['userAttendance'], () => getTotalAttendance(tokenValue)
    );

    useEffect(() => {
        if (totalAttendance && totalAssignment) {
            let totalNameObject = getTotalNameObject(totalAssignment);
            totalAttendance.forEach((userAttendance: UserAttendance, i: number) => {
                if (totalNameObject[userAttendance.name].track == userAttendance.track) {
                    totalNameObject[userAttendance.name].tardiness = userAttendance.tardiness;
                    totalNameObject[userAttendance.name].truancy = userAttendance.truancy;
                    totalNameObject[userAttendance.name].absence = userAttendance.absence;
                    totalNameObject[userAttendance.name].totalScore = getTotalScore({
                        'notSubmitted': totalNameObject[userAttendance.name].notSubmitted,
                        'lateSubmitted': totalNameObject[userAttendance.name].lateSubmitted,
                        'absence': totalNameObject[userAttendance.name].absence,
                        'truancy': totalNameObject[userAttendance.name].truancy,
                        'tardiness': totalNameObject[userAttendance.name].tardiness,
                    });
                }
            });
            setTotalScoreArray(Object.values(totalNameObject));
        }
    }, [totalAssignment, totalAttendance]);


    return (
        <Wrapper>
            <AttendanceRow>
                <AttendanceTitle>이름</AttendanceTitle>
                <AttendanceTitle>트랙</AttendanceTitle>
                {Array.from({ length: 6 }, (_, i) => (
                    <AttendanceTitle key={i}>{ATTENDANCE_CATEGORY_NAME[i]}</AttendanceTitle>
                ))}
            </AttendanceRow>
            {
                totalScoreArray.map((userScore, i) => (
                    <AttendanceRow key={i}>
                        <AttendanceScore >{userScore.name}</AttendanceScore>
                        <AttendanceScore >{TRACK_NAME[userScore.track]}</AttendanceScore>
                        <AttendanceScore >{userScore.absence}</AttendanceScore>
                        <AttendanceScore >{userScore.truancy}</AttendanceScore>
                        <AttendanceScore >{userScore.tardiness}</AttendanceScore>
                        <AttendanceScore >{userScore.notSubmitted}</AttendanceScore>
                        <AttendanceScore >{userScore.lateSubmitted}</AttendanceScore>
                        <AttendanceScore>{userScore.totalScore}</AttendanceScore>
                    </AttendanceRow>
                ))
            }
        </Wrapper>
    );
};
export default TotalScoreSection;



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