import React from 'react';
import styled from 'styled-components';

const UploadButton = () => {
    return (
        <Wrapper>
            <div className='line horizental'/>
            <div className='line vertical' />
        </Wrapper>
    );
};

export default UploadButton;


const Wrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
background-color: #1A21BD;
border-radius: 10rem;
width: 4rem;
height: 4rem;
padding: 1rem;

.line{
    text-align: center;
    background-color: white;
    border-radius: 30%;
    
}

.horizental{
    position: absolute;
    width: 2rem;
    height: 0.2rem;

    
}

.vertical{
    height: 2rem;
    width: 0.2rem;

}
`