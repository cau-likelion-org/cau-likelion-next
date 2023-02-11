import { ArchivingArrayType } from '@@types/request';
import Archiving from '@archiving/Archiving';
import React from 'react';
import { useQuery } from 'react-query';
import { getGalleries } from 'src/apis/gallery';

const GalleryListSection = ({ staticData }: { staticData: ArchivingArrayType; }) => {
    const { data, isLoading } = useQuery<ArchivingArrayType>(['galleries'], getGalleries);

    return (
        <>
            {Object.entries(isLoading ? staticData : (data as ArchivingArrayType))!.map(([year, value]) => (
                <Archiving archivingType={'gallery'} archivingIndex={year} archivingData={value} key={year} />
            ))}
        </>
    );
};

export default GalleryListSection;