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
                    <Image src={Img} width={'20px'} height={'20px'} alt='share' />
                    {/* <Img width={'30px'} height={'30px'} viewBox='0 0 50 50' preserveAspectRatio="xMinYMin meet" /> */}
                </Button>
            </a>
        </Link>
    );
};

export default FooterButton;

const Button = styled.div`
    background-color: ${Primary.default};
    width: 40px;
    height: 40px;
    border-radius: 1.2rem;
    display : inline-flex;
    justify-content: center;
    align-items: center;
`;

