import { UserAttendance, UserScore } from '@@types/request';
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

    const { data: totalAssignment, isLoading: totalAssignmentLoading, error: totalAssignmentError } = useQuery(
        ['userAssignment'], () => getAssignments().then(res => res.data)
    );

    const { data: totalAttendance, isLoading: totalAttendanceLoading, error: totalAttendanceError } = useQuery(
        ['userAttendance'], () => getTotalAttendance(tokenValue)
    );

    useEffect(() => {
        if (totalAttendance && totalAssignment) {
            let tmpObject = getTotalNameObject(totalAssignment);
            if (tmpObject) {
                totalAttendance.forEach((userAttendance: UserAttendance, i: number) => {
                    if (tmpObject[userAttendance.name].track == userAttendance.track) {
                        tmpObject[userAttendance.name].tardiness = userAttendance.tardiness;
                        tmpObject[userAttendance.name].truancy = userAttendance.truancy;
                        tmpObject[userAttendance.name].absence = userAttendance.absence;
                        tmpObject[userAttendance.name].totalScore = getTotalScore({
                            'notSubmitted': tmpObject[userAttendance.name].notSubmitted,
                            'lateSubmitted': tmpObject[userAttendance.name].lateSubmitted,
                            'absence': tmpObject[userAttendance.name].absence,
                            'truancy': tmpObject[userAttendance.name].truancy,
                            'tardiness': tmpObject[userAttendance.name].tardiness,
                        });
                    }
                });
            }
            setTotalScoreArray(Object.values(tmpObject));
        }
    }, [totalAssignment, totalAttendance]);


    return (
        <Wrapper>
            <AttendanceRow>
                <AttendanceTitle index={0}>이름</AttendanceTitle>
                <AttendanceTitle index={1}>트랙</AttendanceTitle>
                {Array.from({ length: 6 }, (_, i) => (
                    <AttendanceTitle index={i + 2} key={i}>{ATTENDANCE_CATEGORY_NAME[i]}</AttendanceTitle>
                ))}
            </AttendanceRow>
            {
                totalScoreArray.map((userScore, i) => (
                    <AttendanceRow key={i}>
                        <AttendanceScore>{userScore.name}</AttendanceScore>
                        <AttendanceScore>{TRACK_NAME[userScore.track]}</AttendanceScore>
                        <AttendanceScore>{userScore.absence}</AttendanceScore>
                        <AttendanceScore>{userScore.truancy}</AttendanceScore>
                        <AttendanceScore>{userScore.tardiness}</AttendanceScore>
                        <AttendanceScore>{userScore.notSubmitted}</AttendanceScore>
                        <AttendanceScore>{userScore.lateSubmitted}</AttendanceScore>
                        <AttendanceScore type={'total'}>{userScore.totalScore}</AttendanceScore>
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
`;

const AttendanceTitle = styled.div<{ index: number; }>`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    flex-basis: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${GreyScale.light};
    border-right: ${props => props.index == 7 ? 'none' : '1px solid gray'};
`;

const AttendanceScore = styled.div<{ type?: string; }>`
     font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    flex-basis: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: ${props => props.type == 'total' ? 'none' : '1px solid gray'};
`;