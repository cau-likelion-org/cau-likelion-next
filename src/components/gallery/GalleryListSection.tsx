import { ArchivingArrayType, IGalleryData } from '@@types/request';
import Archiving from '@archiving/Archiving';
import { sortArchivingListDesc } from '@utils/index';
import React from 'react';
import { useQuery } from 'react-query';
import { getGalleries } from 'src/apis/gallery';
import styled from 'styled-components';

const GalleryListSection = ({ staticData }: { staticData: ArchivingArrayType<IGalleryData>; }) => {
  const { data, isLoading } = useQuery<ArchivingArrayType<IGalleryData>>(['galleries'], getGalleries);

  return (
    <Wrapper>
      {sortArchivingListDesc(isLoading ? staticData : (data as ArchivingArrayType<IGalleryData>))!.map(([year, value]) => (
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