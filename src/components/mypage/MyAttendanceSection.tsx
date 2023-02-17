import { UserAttendance, UserAssignment } from '@@types/request';
import { ATTENDANCE_CATEGORY, ATTENDANCE_CATEGORY_NAME } from '@utils/constant';
import { BackgroundColor, GreyScale, Primary } from '@utils/constant/color';
import { getTotalScore } from '@utils/index';
import React, { useState } from 'react';
import { useEffect } from 'react';
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

    const [totalScore, setTotalScore] = useState<number>(0);

    useEffect(() => {
        const score = getTotalScore({
            'absence': userAttendance.absence,
            'truancy': userAttendance.truancy,
            'tardiness': userAttendance.tardiness,
            'notSubmitted': userAssignment.notSubmitted,
            'lateSubmitted': userAssignment.lateSubmitted
        });
        setTotalScore(score);
    }, [userAssignment, userAttendance]);

    return (
        <Wrapper>
            <TitleText>출석현황</TitleText>
            <CallOut>
                <Row><span>기본 점수</span> 3점</Row>
                <Row><span>지각(5분)</span> -0.5점</Row>
                <Row><span>무단결석</span> -1.5점</Row>
                <Row><span>결석</span> - 1점</Row >
                <Row><span>과제 미제출</span> - 1점 </Row >
                <Row><span>추후 제출 시</span> + 0.8점</Row >
            </CallOut>
            <AttendanceBox>
                <>
                    {attendanceData.map((attendance, i) => (
                        <AttendanceRow key={i} index={i}>
                            <AttendanceTitle>{ATTENDANCE_CATEGORY_NAME[attendance.type]}</AttendanceTitle>
                            <AttendanceScore>{attendance.score}</AttendanceScore>
                        </AttendanceRow>
                    ))}
                </>
                <AttendanceRow index={5}>
                    <AttendanceTitle>{ATTENDANCE_CATEGORY_NAME[ATTENDANCE_CATEGORY.TOTALSCORE]}</AttendanceTitle>
                    <AttendanceScore>{totalScore}</AttendanceScore>
                </AttendanceRow>
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