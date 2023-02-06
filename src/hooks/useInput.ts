import { Dispatch, SetStateAction, useState } from 'react';

type Handler = (e: any) => void;
type ReturnTypes<T = any> = [T, Handler, Dispatch<SetStateAction<T>>];

const useInput = <T = any>(initialValue: T, regExp?: RegExp): ReturnTypes<T> => {
    const [value, setValue] = useState(initialValue);
    const handler: Handler = (e) => {
        if (regExp) {
            if (regExp.test(e.target.value)) {
                setValue(e.target.value);
            }
        }
        else {
            setValue(e.target.value);
        }
    };

    return [value, handler, setValue];
};

export default useInput;