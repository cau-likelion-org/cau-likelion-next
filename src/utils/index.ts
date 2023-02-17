// 각종 utils,추후 추가 및 수정

import { AttendanceTotalScore } from "@@types/request";

export const toDateString = (date?: Date, formatter = "-") => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return year + formatter + month + formatter + day;
};

export const isEmptyString = (str: string) => {
    if (str.length == 0) return true;
    else return false;
};

export const getTotalScore = (data: AttendanceTotalScore) => {
    const defaultScore = 3;
    const totalScore = defaultScore - (1 * data.absence) + (0.8 * data.lateSubmitted) - (1 * data.notSubmitted) - (0.5 * data.tardiness) - (1.5 * data.truancy);
    return totalScore;
};