import { ArchivingArrayType } from '@@types/request';
import Archiving from '@archiving/Archiving';
import React from 'react';
import { useQuery } from 'react-query';
import { getGalleries } from 'src/apis/gallery';

const GalleryListSection = ({ staticData }: { staticData: ArchivingArrayType; }) => {
    const { data, isLoading } = useQuery<ArchivingArrayType>(['projects'], getGalleries);

    return (
        <>
            {Object.entries(isLoading ? staticData : (data as ArchivingArrayType))!.map(([generation, value]) => (
                <Archiving archivingType={'gallery'} archivingIndex={generation} archivingData={value} key={generation} />
            ))}
        </>
    );
};

export default GalleryListSection;