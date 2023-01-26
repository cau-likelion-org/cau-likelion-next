import React from 'react';
import styled from 'styled-components';

const VideoSection = () => {
    return (
        <Wrapper>
            <Video autoPlay muted>
                <source src={"/image/top_hack_your_life.mp4"} type="video/mp4" />
            </Video>
        </Wrapper>
    );
};

export default VideoSection;

const Video = styled.video`
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;