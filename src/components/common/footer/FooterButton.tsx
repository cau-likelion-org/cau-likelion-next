import { Primary } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';

interface FooterButtonProps {
  Img: string;
  link: string;
}

const FooterButton = ({ Img, link }: FooterButtonProps) => {
  return (
    <Link href={link}>
      <a target="_blank" rel="sponsored">
        <Button>
          <ImageWrapper>
            <Image src={Img} alt="share" layout="fill" />
          </ImageWrapper>
        </Button>
      </a>
    </Link>
  );
};

export default FooterButton;

const Button = styled.div`
  background-color: ${Primary.default};
  border-radius: 1.2rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  width: 40px;
  height: 40px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
`;
