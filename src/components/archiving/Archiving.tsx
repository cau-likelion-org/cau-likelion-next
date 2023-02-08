import React from 'react';
import styled from 'styled-components';
import { IArchivingData } from '../project/Projects/ProjectsSection';
import Card from './Card';

const Archiving = ({ archivingIndex, archivingData }: { archivingIndex: string; archivingData: IArchivingData[] }) => {
  return (
    <Wrapper>
      <Generation>{archivingIndex}기</Generation>
      <CardWrapper>
        {archivingData.map((data, index) => (
          <Card
            key={index}
            thumbnail={data.thumbnail}
            title={data.title}
            description={data.description}
            dev_stack={data.dev_stack}
            category={data.category}
          />
        ))}
      </CardWrapper>
    </Wrapper>
  );
};

export default Archiving;
const Wrapper = styled.div`
  margin-bottom: 30px;
`;
const Generation = styled.div`
  font-weight: 900;
  font-size: 2.3rem;
  margin-bottom: 20px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
`;
