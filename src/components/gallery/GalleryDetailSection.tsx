import { IGalleryDetail } from '@@types/request';
import { Basic, GreyScale } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

const GalleryDetailSection = ({ galleryDetail }: { galleryDetail: IGalleryDetail; }) => {
  return (
    <Wrapper>
      <LeftWrapper>
        <TitleText>{galleryDetail.title}</TitleText>
        <DateText>{galleryDetail.date}</DateText>
      </LeftWrapper>
      <RightWrapper>
        <DescriptionBox>{galleryDetail.description}</DescriptionBox>
      </RightWrapper>
    </Wrapper>
  );
};

export default GalleryDetailSection;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  @media (max-width: 900px){
    flex-direction: column;
    align-items: start;
    gap: 1rem;
  }
`;

const LeftWrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media (max-width: 900px){
    padding: 4rem 2rem 0rem 2rem;
  }
`;

const TitleText = styled.div`
  font-family: 'GmarketSans';
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

const RightWrapper = styled.div`
  flex-basis: 70%;
  padding: 2rem;
  @media (max-width: 900px){
    padding: 2rem 2rem 0rem 2rem;
  }
`;

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
  @media(max-width:900px){padding:0rem;}
`;
