import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

type UseInputReturn = [string, (event: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<string>>];

const useInput = (initialValue: string, regExp?: RegExp): UseInputReturn => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!regExp || regExp.test(event.target.value)) {
      setValue(event.target.value);
    }
  };

  return [value, handleChange, setValue];
};

export default useInput;
