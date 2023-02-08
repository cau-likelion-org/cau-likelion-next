import { GreyScale } from '@utils/constant/color';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { IGenerationData } from './ProjectsSection';

const Projects = ({ generation, generationData }: { generation: string; generationData: IGenerationData[] }) => {
  return (
    <Wrapper>
      <Generation>{generation}기</Generation>
      <CardWrapper>
        {generationData.map((data, index) => (
          <Card key={index}>
            <ImageWrapper>
              <CustomImage src={data.thumbnail} alt="썸네일" layout="fill" objectFit="fill" objectPosition="center" />
            </ImageWrapper>
            <TextWrapper>
              <Event>{data.event}</Event>
              <ProjectTitle>{data.title}</ProjectTitle>
              <ProjectDesc>{data.description}</ProjectDesc>
            </TextWrapper>
          </Card>
        ))}
      </CardWrapper>
    </Wrapper>
  );
};

export default Projects;
const Wrapper = styled.div``;
const Generation = styled.div`
  font-weight: 900;
  font-size: 2.3rem;
  margin-bottom: 20px;
`;
const CustomImage = styled(Image)`
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`;
const Card = styled.div`
  border-radius: 25px;
  box-shadow: 10px 10px 50px rgba(68, 64, 105, 0.08);
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;
const ImageWrapper = styled.div`
  position: relative;
  width: 380px;
  height: 213px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

  @media (max-width: 1550px) {
    width: 252px;
    height: 150px;
  }
`;
const TextWrapper = styled.div`
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  width: 380px;
  padding: 20px;
  @media (max-width: 1550px) {
    width: 252px;
  }
`;
const Event = styled.div`
  border-color: ${GreyScale.default};
  border-radius: 25px;
  width: 58px;
  height: 19px;
  border-style: solid;
  border-width: 1px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProjectTitle = styled.div`
  font-size: 2.3rem;
  font-weight: 700;
  font-family: 'Pretendard';
  margin: 10px 0;
`;
const ProjectDesc = styled.div`
  font-size: 1.7rem;
  font-weight: 500;
  color: ${GreyScale.default};
`;
