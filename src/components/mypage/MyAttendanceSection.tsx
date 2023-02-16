import { UserAttendance, UserAssignment } from '@@types/request';
import { ATTENDANCE_CATEGORY, ATTENDANCE_CATEGORY_NAME } from '@utils/constant';
import { GreyScale } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

const MyAttendanceSection = ({ userAttendance, userAssignment }: { userAttendance: UserAttendance; userAssignment: UserAssignment; }) => {
    const attendanceData = [
        {
            type: ATTENDANCE_CATEGORY.ABSENCE,
            score: userAttendance.absence
        },
        {
            type: ATTENDANCE_CATEGORY.TRUANCY,
            score: userAttendance.truancy
        },
        {
            type: ATTENDANCE_CATEGORY.TARDINESS,
            score: userAttendance.tardiness
        },
        {
            type: ATTENDANCE_CATEGORY.NOTSUBMITTED,
            score: userAssignment.notSubmitted
        },
        {
            type: ATTENDANCE_CATEGORY.LATESUBMITTED,
            score: userAssignment.lateSubmitted
        },
    ];
    return (
        <Wrapper>
            <TitleText>출석현황</TitleText>
            <AttendanceBox>
                {attendanceData.map((attendance, i) => (
                    <AttendanceRow key={i} index={i}>
                        <AttendanceTitle>{ATTENDANCE_CATEGORY_NAME[attendance.type]}</AttendanceTitle>
                        <AttendanceScore>{attendance.score}</AttendanceScore>
                    </AttendanceRow>
                ))}
            </AttendanceBox>
        </Wrapper>
    );
};

export default MyAttendanceSection;

const Wrapper = styled.div`
    width: 100%;
`;

const TitleText = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 1.7rem;
`;

const AttendanceBox = styled.div`
    margin: 3rem 0;
    width: 100%;
    min-height: 86px;
    border-radius: 10px;
    display: flex;
    border: 1px solid #BBBBBB;
    justify-content: space-between;
    overflow: hidden;
`;
const AttendanceRow = styled.div<{ index: number; }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-right: ${props => props.index < 5 ? `1px solid #BBBBBB` : 'none'};
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