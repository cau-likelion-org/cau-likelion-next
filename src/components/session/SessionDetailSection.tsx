import React from 'react';
import styled from 'styled-components';
import { Basic, GreyScale} from '@utils/constant/color';

import { ISessionDetail } from '@@types/request';

const SessionDetailSection = ({ sessionDetail }: { sessionDetail: ISessionDetail; }) => {
    return (
        <Wrapper>
            <LeftWrapper>
                    <DateText>{sessionDetail.date}</DateText>
                    <TitleText>{sessionDetail.title}</TitleText>
                    <PresenterText>
                        <b>진행자</b>
                        {sessionDetail.presenter}
                    </PresenterText>
            </LeftWrapper>


            <RightWrapper>
                <TopicText>
                    <b>세션 주제</b>
                    {sessionDetail.topic}
                </TopicText>

                <DescriptionBox>
                    {sessionDetail.description}
                </DescriptionBox>

                {sessionDetail.reference ? 
                <ReferenceBox>
                    <b> 세션 자료 </b>
                    {sessionDetail.reference.map((data,i)=>{
                        return(<div key={i}>{data}</div>)
                    })}
                </ReferenceBox>
                :
                null}

            </RightWrapper>

        
        </Wrapper>
    );
};

export default SessionDetailSection;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    /* align-items: center; */
    gap: 3rem;
`;

const LeftWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 5rem;
` 

const RightWrapper = styled.div`
    flex-basis: 70%;
    padding: 2rem;
`;

const TitleText = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 900;
    font-size: 3rem;
    margin-bottom: 0.7rem;
    color: ${Basic.default};
`;

const DateText = styled(TitleText)`
    font-weight: 500;
    font-size: 1.4rem;
    color: ${GreyScale.default};
`;

const PresenterText = styled.div`
    display: flex;
    font-weight: 500;
    font-size: 1.4rem;
    gap: 1rem;
`

const TopicText = styled.div`
    display: flex;
    gap: 2rem;
    padding: 3rem 3rem 0 3rem;
    font-size: 2rem;
    color: ${Basic.default};
    font-weight: 500;
    line-height: 2.5rem;
    font-family: 'Pretendard';
    font-style: normal;
    
`

const DescriptionBox = styled.div`
    padding: 3rem;
    font-size: 1.4rem;
    color: ${Basic.default};
    font-weight: 500;
    line-height: 2.5rem;
    font-family: 'Pretendard';
    font-style: normal;
    display: flex;
    justify-content: center;
    align-items: center;
    word-wrap: break-word;
`;

const ReferenceBox = styled.div`
    display: flex;
    flex-direction: column;
    flex-basis: start;

    padding: 2rem;
    margin: 2rem;
    font-size: 1.4rem;
    color: ${Basic.default};
    font-weight: 500;
    line-height: 2.5rem;
    font-family: 'Pretendard';
    font-style: normal;
    background-color: #F5F5F5;
    border-radius: 10px;
    word-wrap: break-word;

div{
    gap: 2rem;
}
`

