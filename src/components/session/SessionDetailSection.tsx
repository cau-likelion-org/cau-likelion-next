import React from 'react';
import styled from 'styled-components';
import { Basic, GreyScale } from '@utils/constant/color';

import { ISessionDetail } from '@@types/request';

const SessionDetailSection = ({ sessionDetail }: { sessionDetail: ISessionDetail }) => {
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

        <DescriptionBox>{sessionDetail.description}</DescriptionBox>

        {/* {sessionDetail.reference ? (
          <ReferenceBox>
            <b> 세션 자료 </b>
            <div>{sessionDetail.reference}</div>
          </ReferenceBox>
        ) : null} */}
      </RightWrapper>
    </Wrapper>
  );
};

export default SessionDetailSection;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  /* width: 30%; */
  margin-top: 3rem;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: start;
    gap: 1rem;
  }
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  @media (max-width: 900px) {
    padding: 2rem;
  }

  div {
    display: flex;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-left: 2rem;
  margin-top: 2rem;
`;

const TitleText = styled.div`
  font-family: 'Gmarket Sans';
  font-style: normal;
  font-weight: 900;
  font-size: 2.3rem;
  margin-bottom: 0.7rem;
  color: ${Basic.default};
`;

const DateText = styled(TitleText)`
  font-weight: 500;
  font-size: 1.4rem;
  color: ${GreyScale.default};
`;

const PresenterText = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  display: flex;
  font-weight: 500;
  font-size: 1.4rem;
  gap: 1rem;
`;

const TopicText = styled.div`
  display: flex;
  gap: 2rem;
  /* padding: 3rem 3rem 0 3rem; */
  font-size: 1.8rem;
  color: ${Basic.default};
  font-weight: 500;
  line-height: 2.5rem;
  font-family: 'Pretendard';
  font-style: normal;

  @media (max-width: 900px) {
    /* padding: 0rem 3rem; */
  }
`;

const DescriptionBox = styled.div`
  /* padding: 3rem; */
  font-size: 1.4rem;
  color: ${Basic.default};
  font-weight: 500;
  line-height: 2.5rem;
  font-family: 'Pretendard';
  font-style: normal;
  display: flex;
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
  background-color: #f5f5f5;
  border-radius: 10px;
  word-wrap: break-word;

  div {
    gap: 2rem;
  }
`;
