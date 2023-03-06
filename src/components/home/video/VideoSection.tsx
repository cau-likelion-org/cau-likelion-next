import Image from 'next/image';
import styled from 'styled-components';
import hack from '@image/hack-your-life.gif';

const VideoSection = () => {
  return (
    <Wrapper>
      <Image src={hack} width={1206} height={600} objectFit="contain" alt="gif" />
    </Wrapper>
  );
};

export default VideoSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 900px) {
    scroll-snap-align: start;
    min-height: 70vh;
    height: 100%;
  }
  justify-content: center;
`;
