import { ArchivingArrayType, IGalleryData, IProjectData, TotalScoreParams, UserScore } from "@@types/request";
import { GENERATION_CHECKER, TRACK_INDEX } from "./constant";

export const toDateString = (date?: Date, formatter = "-") => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return year + formatter + month + formatter + day;
};

export const concatDateString = (startDate: string, endDate: string) => {
    const startDateArray = startDate.split('-');
    const endDateArray = endDate.split('-');
    const newStartDate = startDateArray.join('.');
    const newEndDate = endDateArray.join('.');
    return newStartDate + '~' + newEndDate;
};

export const isEmptyString = (str: string) => {
    if (str.length == 0) return true;
    else return false;
};

export const getTotalScore = (target: TotalScoreParams) => {
    let defaultScore = 3;
    const totalScore = defaultScore - (1 * target.absence + 0.2 * target.lateSubmitted + 1 * target.notSubmitted + 0.5 * target.tardiness + 1.5 * target.truancy);
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
            user_id: 0,
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

export const sortArchivingListDesc = <T extends IGalleryData | IProjectData>(data: ArchivingArrayType<T>): Array<[string, T[]]> => {
    const newData = Object.entries(data).sort((year, _) => Number(year));
    return newData.reverse();
};
