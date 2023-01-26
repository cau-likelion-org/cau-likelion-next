import { PrimaryBlue } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

interface FooterButtonProps {
    type: string;
    Img: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    link: string;
}

const FooterButton = ({ type, Img, link }: FooterButtonProps) => {
    return (
        <Link href={link}>
            <a target="_blank" rel="sponsored">
                <Button>
                    <Img />
                </Button>
            </a>
        </Link>
    );
};

export default FooterButton;

const Button = styled.div`
    background-color: ${PrimaryBlue.default};
    width: 70px;
    height: 70px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

