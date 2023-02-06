import React, {ReactElement} from 'react';
import styled from 'styled-components'

import LayoutDefault from '@common/layout/LayoutDefault';
import FailedMessage from 'src/components/login/failed/FailedMessage';

const Failed = () => {
    return (
        <Wrapper>
            <FailedMessage />
        </Wrapper>
    );
};

export default Failed;

Failed.getLayout = function getLayout(page: ReactElement) {
    return <LayoutDefault>{page}</LayoutDefault>;
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100vh;
`