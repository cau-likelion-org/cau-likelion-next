import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Card from '@archiving/Card';
import { Primary, GreyScale } from '@utils/constant/color';
import back from '@image/back.png';
import Image from 'next/image';
import { ISessionData } from '@@types/request';
import { MdKeyboardArrowLeft } from 'react-icons/md';

type ModalProps = {
  trackName: string;
  trackData: ISessionData[];
  handleClose: () => void;
  visible: boolean;
};

const SessionModal: React.FC<ModalProps> = ({ trackData, trackName, handleClose, visible }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (visible) {
      setIsOpen(true);
    } else {
      timeoutId = setTimeout(() => setIsOpen(false), 500);
    }

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [visible]);

  return (
    <>
      {isOpen && (
        <>
          <StModalLayer onClick={handleClose} visible={visible} />

          <StModalWrapper visible={visible}>
            <ModalHeader>
              <ButtonWrapper>
                <div>
                  <MdKeyboardArrowLeft
                    size={30}
                    color={GreyScale.default}
                    onClick={handleClose}
                    style={{ cursor: 'pointer' }}
                  />
                  <a>{trackName}</a>
                </div>
                <UploadButton>+</UploadButton>
              </ButtonWrapper>
            </ModalHeader>

            <CardWrapper>
              {trackData
                .slice(0)
                .reverse()
                .map((data, i) => {
                  return (
                    <Card
                      key={data.id}
                      id={data.id}
                      link="/session"
                      thumbnail={data.thumbnail}
                      title={data.title}
                      category={`${data.degree}차 세션`}
                    />
                  );
                })}
            </CardWrapper>
          </StModalWrapper>
        </>
      )}
    </>
  );
};

export default SessionModal;

const fadeIn = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`;

const fadeOut = keyframes`
    0% { opacity: 1; }
    100% { opacity: 0; }
`;

const slideIn = keyframes`
    0% { transform: translateY(100%);}
    100% { transform: translateY(0); }
`;

const slideOut = keyframes`
    0% { transform: translateY(0); }
    100% { transform: translateY(100%);}
`;

const modalSettings = (visible: boolean) => css`
  visibility: ${visible ? 'visible' : 'hidden'};
  animation: ${visible ? fadeIn : fadeOut} 0.3s ease-out;
  transition: visibility 0.3s ease-out;
`;

const StModalLayer = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  overflow: hidden;

  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  animation: ${(props) => (props.visible ? fadeIn : fadeOut)} 0.5s ease-out;

  @media (max-width: 900px) {
    display: none;
  }
`;

const StModalWrapper = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  z-index: 10000;
  position: absolute;
  background: #ffffff;
  border-radius: 24px;
  overflow-y: scroll;
  height: 100vh;
  box-shadow: 10px 10px 60px rgba(0, 0, 0, 0.4);

  @media (min-width: 900px) {
    overflow: auto;
    top: 3%;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  ${(props) => modalSettings(props.visible)};

  //<전체보기> 눌렀을 때 모달창 초기 높이, 너비
  @media (min-width: 1920px) {
    max-height: 80vh;
    width: 150rem;
  }

  @media (min-width: 1661px) and (max-width: 1919px) {
    max-height: 80vh;
    width: 120rem;
  }

  @media (min-width: 901px) and (max-width: 1660px) {
    max-height: 80vh;
    width: 100rem;
  }

  @media (max-width: 900px) {
    min-height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    padding: 3rem 0;
    border-radius: 0px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 10rem;
    z-index: 10001;
    background-color: #ffffff;
    border-bottom: solid 0.2rem #d7d7d7;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3rem 1rem;

  div {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  @media (max-width: 1920px) {
    font-size: 25px;
  }
  @media (max-width: 900px) {
    font-size: 20px;
  }
`;

const CardWrapper = styled.div`
  height: 100%;
  display: grid;
  background-color: white;
  gap: 20px;
  grid-template-columns: 1fr 1fr 1fr;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin: 1rem 0 3rem 0;
  ::-webkit-scrollbar {
    display: none;
  }
  overflow: scroll;
  @media (max-width: 900px) {
    margin: 13rem 0 3rem 0;
  }
  @media (min-width: 1920px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }

  @media (min-width: 901px) and (max-width: 1660px) {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  @media (min-width: 600px) and (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  @media (min-width: 360px) and (max-width: 601px) {
    grid-template-columns: 1fr;
    gap: 30px;
  } ;
`;

const UploadButton = styled.button`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 30px;
  color: white;
  background-color: ${Primary.default};

  display: none;
`;

const BackArrow = styled(Image)`
  visibility: hidden;

  @media (max-width: 900px) {
    visibility: visible;
  }
`;
