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
const LinkButton = ({ shareURL }: { shareURL: IShareURL }) => {
  const { web: weburl, github: githuburl, youtube: youtubeurl } = shareURL;
  return (
    <Wrapper>
      {weburl && (
        <Link href={weburl}>
          <ImageWrapper>
            <Image src={ImageObj.web} alt="icon" layout="fill" objectFit="contain" objectPosition="center" />
          </ImageWrapper>
        </Link>
      )}
      {githuburl && (
        <Link href={githuburl}>
          <ImageWrapper>
            <Image src={ImageObj.github} alt="icon" layout="fill" objectFit="contain" objectPosition="center" />
          </ImageWrapper>
        </Link>
      )}
      {youtubeurl && (
        <Link href={youtubeurl}>
          <ImageWrapper>
            <Image src={ImageObj.youtube} alt="icon" layout="fill" objectFit="contain" objectPosition="center" />
          </ImageWrapper>
        </Link>
      )}
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
