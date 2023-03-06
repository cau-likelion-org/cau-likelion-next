import React, { useState } from 'react';
import styled from 'styled-components';
import MakeAttendacneModal from './MakeAttendacneModal';

const MakeAttendanceButton = () => {
  const [modal, setModal] = useState(false);
  const handleClick = () => {
    setModal((prev) => !prev);
  };
  return (
    <>
      <Wrapper onClick={handleClick}>출석부 만들기</Wrapper>
      {modal && (
        <>
          <ModalBackground onClick={handleClick} />
          <MakeAttendacneModal />
        </>
      )}
    </>
  );
};

export default MakeAttendanceButton;

const Wrapper = styled.div`
  cursor: pointer;
  background-color: #333333;
  border-radius: 25px;
  padding: 10px;
  color: #ffffff;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  margin-left: 20px;
`;
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  width: 100vw;
  height: 100vh;
`;
