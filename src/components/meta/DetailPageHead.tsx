import { ARCHIVING } from '@utils/constant';
import Head from 'next/head';
import React from 'react';

interface DetailPageHeadProps {
    title: string;
    img: string;
    canoUrl: string;
    category: ARCHIVING;
    description: string;
}

const DetailPageHead = ({ title, category, img, canoUrl, description }: DetailPageHeadProps) => {
    const descriptionHead = {
        [ARCHIVING.SESSION]: "정기세션",
        [ARCHIVING.GALLERY]: "갤러리",
        [ARCHIVING.PROJECT]: "프로젝트",
    };
    return (
        <Head>
            <title>{title}</title>
            <meta name='viewport' content="initial-scale=1.0, width=device-width" />
            <meta name='description' content={`${descriptionHead[category]}|${description} }`} />
            <meta name="keywords" content="IT개발, 웹개발, 중앙대학교, 멋쟁이사자처럼, 동아리" />
            <meta property="og:title" content={title} />
            <meta property="og:site_name" content="CAU LION" />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canoUrl ?? "https://cau-likelion.org/"} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={img ? img : 'https://cau-likelion.org/image/logoThumbnail.png'} />
            <meta property="twitter:card" content="summary" />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={img ? img : 'https://cau-likelion.org/image/logoThumbnail.png'} />
            <meta property="twitter:url" content={canoUrl ?? "https:/cau-likelion.org/"} />
            <meta name="twitter:creator" content="CAU LION" />
            <link rel="canonical" href={canoUrl}></link>
        </Head>
    );
};

export default DetailPageHead;