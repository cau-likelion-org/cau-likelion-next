import React, { ReactElement } from 'react';
import styled from 'styled-components';
import FailedMessage from 'src/components/login/failed/FailedMessage';
import LayoutNoHeight from '@common/layout/LayoutNoHeight';

const LoginFailed = () => {
    return (
        <Wrapper>
            <FailedMessage />
        </Wrapper>
    );
};

export default LoginFailed;

LoginFailed.getLayout = function getLayout(page: ReactElement) {
    return <LayoutNoHeight>{page}</LayoutNoHeight>;
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;