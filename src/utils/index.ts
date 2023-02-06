// 각종 utils,추후 추가 및 수정

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