import React from 'react';
import styled from 'styled-components';

import { Diamond } from '../common/Diamond';

const BorderSection = () => {
    return (
        <BorderSectionWrapper>
            <span className='bottom'></span>
            <span className='right'></span>
            <span className='top'></span>
            <span className='left'></span>
            <Diamond className='aniDiamond' />
        </BorderSectionWrapper>
    );
};

export default BorderSection;

const BorderSectionWrapper=styled.div`
span{
    position:absolute;
    display: flex;
    justify-content: center; 
    left: 360px;
    right: 360px;

    top: 10rem;
    width: 100%;
    height: 100%;
}

//border-bottom
span:nth-child(1) {
    left:0;
    right:0;
    height: 75rem;
    width: 100%;
    border-bottom: 4px #1A21BD solid;
    border-bottom-right-radius: 70px;

}

//border-right
span:nth-child(2) {
    left:0;
    right:0;
    top: 15rem;
    height: 70rem;
    width: 100%;
    border-right: 4px #1A21BD solid;
    border-radius: 70px;
}

//border-top
span:nth-child(3) {
    left:60rem;
    right:0;
    top: 15rem;
    height: 70rem;
    width: 50%;
    border-top: 4px #1A21BD solid;
    border-radius: 70px;
}

//border-left
span:nth-child(4) {
    left:60rem;
    right:0;
    top: 15rem;
    height: 60rem;
    width: 50%;
    border-left: 4px #1A21BD solid;
    border-top-left-radius: 70px;
}

.aniDiamond{
    position: absolute;
    left:59.7rem;
    right:0rem;
    top: 75rem;
}
    
`
