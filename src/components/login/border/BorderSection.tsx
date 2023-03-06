import React from 'react';
import styled from 'styled-components';

import { Diamond } from '../common/Diamond';

const BorderSection = () => {
  return (
    <BorderSectionWrapper className="outline">
      <span className="width"></span>
      <span className="height"></span>
      <span className="width"></span>
      <span className="height"></span>
      <Diamond className="aniDiamond" />
    </BorderSectionWrapper>
  );
};

export default BorderSection;

const BorderSectionWrapper = styled.div`
  span {
    position: absolute;
    display: flex;
    justify-content: center;
    left: 360px;
    right: 360px;
    width: 100%;
    height: 100%;
  }

  //퍼센트는 애니메이션 진행도를 의미함
  // 0% = 애니메이션 시작 전, 100% = 애니메이션 종료)
  @keyframes drawLine1 {
    0% {
      width: 0;
      border-bottom-right-radius: 0;
    }
    75% {
      border-bottom-right-radius: 0;
    }
    100% {
      width: 100%;
      border-bottom-right-radius: 70px;
    }
  }

  //border-bottom
  span:nth-child(1) {
    display: flex;
    left: 0;
    right: 0;
    top: 25rem;
    height: 50rem;
    border-bottom: 4px #1a21bd solid;
    border-bottom-right-radius: 70px;

    animation-name: drawLine1;
    animation-duration: 0.7s;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    z-index: 0;
  }

  @keyframes drawLine2 {
    0% {
      height: 70rem;
    }
    100% {
      height: 0rem;
    }
  }

  //border-right
  span:nth-child(2) {
    left: 0;
    right: 0;
    top: 25rem;
    height: 50rem;
    width: 100%;

    border-right: 4px #1a21bd solid;
    border-radius: 70px;

    z-index: 2;
  }

  span:nth-child(2)::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 50rem;
    width: 99%;
    border-right: 20px #ffffff solid;
    border-radius: 70px;

    animation-name: drawLine2;
    animation-duration: 0.7s;
    animation-delay: 0.7s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  @keyframes drawLine3 {
    0% {
      width: 50%;
      border-bottom-right-radius: 70px;
      border-top-right-radius: 0;
    }
    75% {
      border-top-right-radius: 0;
    }
    100% {
      width: 0%;
      border-top-right-radius: 70px;
    }
  }

  //border-top
  span:nth-child(3) {
    left: 55rem;
    right: 0;
    top: 25rem;
    height: 50rem;
    width: 45%;
    border-top: 4px #1a21bd solid;
    border-radius: 70px;
    z-index: 0;
  }

  span:nth-child(3):after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: -1rem;
    height: 50rem;
    width: 100%;
    border-top: 20px #ffffff solid;
    border-radius: 70px;

    animation-name: drawLine3;
    animation-duration: 0.7s;
    animation-delay: 1.4s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  @keyframes drawLine4 {
    0% {
      height: 0;
      border-left: 4px #1a21bd solid;
      /* border-left: 4px #FFFFFF solid; */
    }
    1% {
      border-left: 4px #ffffff solid;
    }
    100% {
      height: 40rem;
      border-left: 4px #1a21bd solid;
    }
  }

  //border-left
  span:nth-child(4) {
    left: 55rem;
    right: 0;
    top: 25rem;
    height: 40rem;
    width: 50%;
    border-top-left-radius: 70px;
    z-index: 5;

    animation-name: drawLine4;
    animation-duration: 0.7s;
    animation-delay: 2.1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  @keyframes diamond {
    0% {
      opacity: 0%;
    }
    100% {
      opacity: 100%;
    }
  }

  .aniDiamond {
    position: absolute;
    left: 54.7rem;
    right: 0;
    top: 65rem;
    opacity: 0%;

    animation-name: diamond;
    animation-duration: 0.7s;
    animation-delay: 2.8s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
`;
