import { TotalScoreParams, UserScore } from "@@types/request";
import { GENERATION_CHECKER, TRACK_INDEX } from "./constant";

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

export const getTotalScore = (data: TotalScoreParams) => {
    const defaultScore = 3;
    const totalScore = defaultScore - (1 * data.absence + 0.2 * data.lateSubmitted + 1 * data.notSubmitted + 0.5 * data.tardiness + 1.5 * data.truancy);
    return totalScore;
};

export const checkGeneration = (generation: number) => {
    let year = new Date().getFullYear();
    if (year - generation == GENERATION_CHECKER) return true;
    return false;
};


export const getTotalNameObject = (data: any): Record<string, UserScore> => {
    let totalNameObject: Record<string, UserScore> = {};
    data.forEach((user: any, i: number) => {
        totalNameObject[user['이름']] = {
            name: user['이름'],
            track: TRACK_INDEX[user['트랙']],
            lateSubmitted: user['과제 지각제출'],
            notSubmitted: user['과제 미제출'],
            absence: 0,
            truancy: 0,
            tardiness: 0,
            totalScore: 0,
        };
    });
    return totalNameObject;
};
