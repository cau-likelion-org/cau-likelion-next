import React from 'react';
import LeftSection from './component/LeftSection';
import RightSection from './component/RightSection';

const ContentsSection = () => {
    return (
        <>
            <LeftSection justify-contents='end'/>
            <RightSection justify-contents='start' />
        </>
    );
};

export default ContentsSection;