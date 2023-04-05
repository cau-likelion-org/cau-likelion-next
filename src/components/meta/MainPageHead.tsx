import Head from 'next/head';
import React from 'react';

const MainPageHead = ({ canoUrl, title }: { canoUrl?: string; title?: string; }) => {
    return (
        <Head>
            <title>{title ?? 'CAU LION | 중앙대학교 멋쟁이사자처럼'}</title>
            <meta name='viewport' content="initial-scale=1.0, width=device-width" />
            <meta name='description' content={"중앙대학교 멋쟁이사자처럼을 위한 단 하나뿐인 커뮤니티, CAU LION"} />
            <meta name="keywords" content="IT개발, 웹개발, 중앙대학교, 멋쟁이사자처럼, 동아리" />
            <meta property="og:title" content={title ?? 'CAU LION | 중앙대학교 멋쟁이사자처럼'} />
            <meta property="og:site_name" content="CAU LION" />
            <meta property="og:description" content="중앙대학교 멋쟁이사자처럼을 위한 단 하나뿐인 커뮤니티, CAU LION" />
            <meta property="og:url" content="https://cau-likelion.org" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content='https://cau-likelion.org/image/logoThumbnail.png' />
            <meta property="twitter:card" content="summary" />
            <meta property="twitter:title" content={title ?? 'CAU LION | 중앙대학교 멋쟁이사자처럼'} />
            <meta property="twitter:description" content="중앙대학교 멋쟁이사자처럼을 위한 단 하나뿐인 커뮤니티, CAU LION" />
            <meta property="twitter:image" content='https://cau-likelion.org/image/logoThumbnail.png' />
            <meta property="twitter:url" content={canoUrl ?? "https://cau-likelion.org"} />
            <meta name="twitter:creator" content="CAU LION" />
            <link rel="canonical" href={canoUrl}></link>
        </Head>
    );
};

export default MainPageHead;