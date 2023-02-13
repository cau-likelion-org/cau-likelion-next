import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { Primary } from '@utils/constant/color';
import { MemberStack, MemberStackKor } from '@@types/request';


const Track = ({track}:{track:string}) => {
    return (
        <StWrapper>
            <p> {track} </p>
            <StShowAll>전체보기 &gt;</StShowAll>
        </StWrapper>
        
    );
};

export default Track;


const StWrapper = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`

const StShowAll = styled.div`
    color:${Primary};
    font-size: 1.4rem;
`