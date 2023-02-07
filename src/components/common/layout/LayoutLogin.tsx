import { BackgroundColor } from '@utils/constant/color';
import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';
import styled from 'styled-components';
import { ReactElement } from 'react';

const LayoutLogin = ({ children }: { children: ReactElement; }) => {
    return (
        <>
            <main>
                <PageContainer>{children}</PageContainer>
            </main>
        </>
    );
};

export default LayoutLogin;

const PageContainer = styled.div`
background-color: ${BackgroundColor};
min-height: calc(100vh - 270px);
width: 100%;

/* @media (max-width: 1440px) {
    padding: 0 250px;
}

@media (max-width: 1280px) {
    padding: 0 150px;
} */
    padding: 0 360px;
`;
