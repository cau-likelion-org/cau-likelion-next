import { IShareURL } from '@@types/request';
import github from '@image/github.png';
import webLink from '@image/weblink.png';
import youtube from '@image/youtube.png';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';
const ImageObj = {
  github: github,
  web: webLink,
  youtube: youtube,
};
const LinkButton = ({ shareURL }: { shareURL: IShareURL[] }) => {
  return (
    <Wrapper>
      {shareURL.map(({ type, src }, index) => (
        <Link href={src} key={index}>
          <ImageWrapper>
            <Image src={ImageObj[type]} alt="icon" layout="fill" objectFit="contain" objectPosition="center" />
          </ImageWrapper>
        </Link>
      ))}
    </Wrapper>
  );
};

export default LinkButton;
const Wrapper = styled.div`
  display: flex;
`;
const ImageWrapper = styled.div`
  width: 30px;
  height: 30px;
  position: relative;
  margin: 7px 7px;
  cursor: pointer;
`;
