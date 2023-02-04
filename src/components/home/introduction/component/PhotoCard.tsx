import styled from 'styled-components';
import Link from 'next/link';

import { HiArrowUpRight } from 'react-icons/hi2';

const PhotoCard = ({
  title,
  subtitle,
  thumbnail,
  routing,
}: {
  title: string;
  subtitle: string;
  thumbnail: string;
  routing: string;
}) => {
  return (
    <>
      <Link href={routing}>
        <Container className="container" img={thumbnail}>
          <BlurBackground className="blur" />
          <Top>
            <SubText className="sub">{subtitle}</SubText>
            <HiArrowUpRight className="arrow" color="#FFFFFF" />
          </Top>
          <Center className="title">
            <TitleText>{title.split(' ')[0]}</TitleText>
            <TitleText>{title.split(' ')[1]}</TitleText>
          </Center>
        </Container>
      </Link>
    </>
  );
};

export default PhotoCard;

const BlurBackground = styled.div`
  background: rgba(80, 80, 80, 0.4);
  -webkit-backdrop-filter: blur(50px);
  backdrop-filter: blur(50px);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1;
  border-radius: 20px;
`;

const Container = styled.div<{ img: string }>`
  &:hover {
    .blur {
      opacity: 1;
      transition: 0.4s ease-in-out;
    }
    .title {
      visibility: visible;
      transition: 2s ease-in;
    }
    .arrow {
      visibility: visible;
      transition: 2s ease-in;
    }
    .sub {
      visibility: hidden;
      transition: 0.1s ease;
    }
  }
  .blur {
    opacity: 0;
  }
  .arrow {
    visibility: hidden;
    width: 35px;
    height: 35px;
    font-weight: bold;
  }
  .title {
    visibility: hidden;
  }
  .sub {
    visibility: visible;
  }
  cursor: pointer;
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 433px;
  @media (max-width: 1376px) {
    height: 300px;
  }
  position: relative;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const TitleText = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 5rem;
  line-height: 153.02%;
  color: #ffffff;
`;

const SubText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 33px;
  background-color: #33333399;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #ffffff;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
`;

const Top = styled.div`
  z-index: 2;
  flex-basis: 20%;
  display: flex;
  align-items: center;
  margin: 0 30px;
  justify-content: space-between;
`;

const Center = styled.div`
  z-index: 2;
  flex-basis: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
