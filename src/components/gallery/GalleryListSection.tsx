import { ArchivingArrayType, IGalleryData } from '@@types/request';
import Archiving from '@archiving/Archiving';
import { sortArchivingListDesc } from '@utils/index';
import React from 'react';
import useGalleries from 'src/apis/queries/useGalleries';
import styled from 'styled-components';

const GalleryListSection = ({ staticData }: { staticData: ArchivingArrayType<IGalleryData> }) => {
  const { galleries } = useGalleries();

  const displayGalleries = !galleries ? staticData : galleries;
  const sortedGalleries = sortArchivingListDesc(displayGalleries);

  return (
    <Wrapper>
      {sortedGalleries.map(([year, value]) => (
        <Archiving archivingType={'gallery'} archivingIndex={year} archivingData={value} key={year} />
      ))}
    </Wrapper>
  );
};

export default GalleryListSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem;
`;
