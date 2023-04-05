import { ARCHIVING, MENU, META_DESCRIPTION, META_DESCRIPTION_HEAD } from '@utils/constant';
import Head from 'next/head';
import React from 'react';

interface ListPageHeadProps {
    canoUrl: string;
    category: ARCHIVING;
}

const ListPageHead = ({ canoUrl, category }: ListPageHeadProps) => {
    return (
        <Head>
            <title>{`CAU LION | ${META_DESCRIPTION_HEAD[category]}`}</title>
            <meta name='viewport' content="initial-scale=1.0, width=device-width" />
            <meta name='description' content={META_DESCRIPTION[category]} />
            <meta name="keywords" content="IT개발, 웹개발, 중앙대학교, 멋쟁이사자처럼, 동아리" />
            <meta property="og:title" content={`CAU LION | ${META_DESCRIPTION_HEAD[category]}`} />
            <meta property="og:site_name" content="CAU LION" />
            <meta property="og:description" content={META_DESCRIPTION[category]} />
            <meta property="og:url" content={canoUrl ?? "https://cau-likelion.org/"} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={'https://cau-likelion.org/image/logoThumbnail.png'} />
            <meta property="twitter:card" content="summary" />
            <meta property="twitter:title" content={`CAU LION | ${META_DESCRIPTION_HEAD[category]}`} />
            <meta property="twitter:description" content={META_DESCRIPTION[category]} />
            <meta property="twitter:image" content={'https://cau-likelion.org/image/logoThumbnail.png'} />
            <meta property="twitter:url" content={canoUrl ?? "https:/cau-likelion.org/"} />
            <meta name="twitter:creator" content="CAU LION" />
            <link rel="canonical" href={canoUrl}></link>
        </Head>
    );
};

export default ListPageHead;