import { IArchivingData } from '@@types/request';
import { TRACK } from '@utils/constant';
import React from 'react';
import styled from 'styled-components';
import Card from './Card';

const getIndexMessage = (value: string) => {
  const number = parseInt(value);
  if (number < 4) {
    return TRACK[number];
  }
  if (number > 2000) {
    return `${number}년`;
  }
  return `${number}기`;
};

const Archiving = ({ archivingIndex, archivingData }: { archivingIndex: string; archivingData: IArchivingData[] }) => {
  return (
    <Wrapper>
      <ArchivingIndex>{getIndexMessage(archivingIndex)}</ArchivingIndex>
      <CardWrapper>
        {archivingData.map((data, index) => (
          <Card
            key={index}
            id={data.id}
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
const ArchivingIndex = styled.div`
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
