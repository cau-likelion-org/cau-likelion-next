import { Variants } from 'framer-motion';
import { useState } from 'react';

const useSlider = <T>(
  data: T[],
  duration?: number,
  moveScale?: number,
  opacity?: boolean,
  type?: 'spring' | 'linear' | 'tween' | 'inertia',
): [index: number, direction: number, increase: () => void, decrease: () => void, animationVariant: Variants] => {
  const [[index, direction], setIndex] = useState([0, 0]);
  function increase() {
    setIndex((prev) => (prev[0] > data.length - 2 ? [0, +1] : [index + 1, +1]));
  }
  function decrease() {
    setIndex((prev) => (prev[0] < 1 ? [data.length - 1, -1] : [index - 1, -1]));
  }

  // 애니메이션 효과 관련 코드 initial은 초기(등장시 초기값), visible은 initial에서 랜더링될시까지 보여줄 애니메이션, exit은 visible에서 컴포넌트가 지워질때 보여줄 애니메이션
  const animationVariant = {
    initial: (direction: number) => {
      return {
        x: moveScale ? (direction > 0 ? moveScale : -moveScale) : direction > 0 ? 1000 : -1000,
        opacity: opacity && 0,
        transition: {
          duration: duration ? duration : 0.5,
          type: type && type,
        },
      };
    },
    visible: {
      x: 0,
      opacity: opacity && 1,
      transition: {
        duration: duration ? duration : 0.5,
        type: type && type,
      },
    },
    exit: (direction: number) => {
      return {
        opacity: opacity && 0,
        x: moveScale ? (direction < 0 ? moveScale : -moveScale) : direction < 0 ? 1000 : -1000,
        transition: {
          duration: duration ? duration : 0.5,
          type: type && type,
        },
      };
    },
  };
  return [index, direction, decrease, increase, animationVariant as Variants];
};

export default useSlider;
