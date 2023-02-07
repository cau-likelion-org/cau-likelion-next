import React, { ReactElement } from 'react';
import styled from 'styled-components';
import FailedMessage from 'src/components/login/failed/FailedMessage';

const Failed = () => {
    return (
        <Wrapper>
            <FailedMessage />
        </Wrapper>
    );
};

export default Failed;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;