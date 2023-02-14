import { useState } from 'react';

const useSlider = <T>(data: T[]): [index: number, direction: number, increase: () => void, decrease: () => void] => {
  const [[index, direction], setIndex] = useState([0, 0]);

  function increase() {
    setIndex((prev) => (prev[0] > data.length - 2 ? [0, +1] : [index + 1, +1]));
  }
  function decrease() {
    setIndex((prev) => (prev[0] < 1 ? [data.length - 1, -1] : [index - 1, -1]));
  }
  return [index, direction, increase, decrease];
};

export default useSlider;
