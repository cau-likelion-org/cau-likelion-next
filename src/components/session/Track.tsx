import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import SessionModal from './SessionModal';
import { ISessionData } from '@@types/request';
import { Primary } from '@utils/constant/color';

type TrackProps = {
  track: string;
  trackData: ISessionData[];
};

const Track: React.FC<TrackProps> = ({ track, trackData }) => {
  const [visible, setVisible] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    setVisible(true);

    document.body.style.cssText = `
        position: fixed; 
        width: 100%;
        `;
  };

  const handleClose = () => {
    setVisible(false);

    document.body.style.cssText = `
        position: ''; 
        width: ''`;
  };

  return (
    <>
      <StWrapper>
        <TrackTitle>{track}</TrackTitle>
        {trackData.length ? <StShowAll onClick={handleClick}>전체보기 &gt;</StShowAll> : null}
      </StWrapper>
      <SessionModal trackData={trackData} trackName={track} handleClose={handleClose} visible={visible} />
    </>
  );
};

export default Track;

const StWrapper = styled.div`
  display: flex;
  font-family: 'GmarketSans';
  justify-content: space-between;
  align-items: center;
  margin: 3rem;
  width: 100%;
  z-index: 10;

  @media (max-width: 700px) {
    margin: 3rem 0 5rem 0;
  }
`;

const StShowAll = styled.div`
  color: ${Primary.default};
  font-size: 1.3rem;
  cursor: pointer;
`;

const TrackTitle = styled.div`
  font-size: 2.3rem;
  color: #464646;
`;
