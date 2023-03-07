import { ArchivingType, IGalleryData, IProjectData, ISessionData } from '@@types/request';
import { TRACK } from '@utils/constant';
import React from 'react';
import styled from 'styled-components';
import Card from './Card';

const getIndexMessageAndURL = (archivingType: ArchivingType, archivingIndex: number) => {
  if (archivingType == 'session') {
    return ['/session', TRACK[archivingIndex]];
  }
  if (archivingType == 'gallery') {
    return ['/gallery', `${archivingIndex}년`];
  }
  return ['/project', `${archivingIndex}기`];
};
const getType = <Type extends ISessionData | IProjectData | IGalleryData>(data: Type) => {
  if ('category' in data) return data.category;
  if ('degree' in data) return data.degree;
  if ('date' in data) return data.date;
};

const Archiving = <Type extends ISessionData | IProjectData | IGalleryData>({
  archivingType,
  archivingIndex,
  archivingData,
}: {
  archivingType: ArchivingType;
  archivingIndex: string;
  archivingData: Type[];
}) => {
  const [link, title] = getIndexMessageAndURL(archivingType, parseInt(archivingIndex));
  return (
    <>
      {archivingData.length ?
        <Wrapper>
          <ArchivingIndex>{title}</ArchivingIndex>
          <CardWrapper>
            {archivingData.map((data, index) => (
              <Card
                key={index}
                id={data.id}
                link={link}
                thumbnail={data.thumbnail}
                // thumbnail={'https://cau-likelion.s3.ap-northeast-2.amazonaws.com/project-img/9%E1%84%80%E1%85%B5/Rectangle_336-1.png}'}
                title={data.title}
                description={data.description}
                dev_stack={'dev_stack' in data ? data.dev_stack : undefined}
                category={getType(data)}
              />
            ))}
          </CardWrapper>
        </Wrapper>
        : null}
    </>
  );
};

export default Archiving;
const Wrapper = styled.div`
  margin-bottom: 30px;
`;
const ArchivingIndex = styled.div`
  color: #464646;

  font-weight: 900;
  font-size: 2.3rem;
  margin-bottom: 20px;
  font-family: 'GmarketSans';
`;

const CardWrapper = styled.div`
  display: grid;
  width: 100%;

  @media (min-width: 766px) and (max-width: 1123px) {
    width: 75%;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (min-width: 1124px) and (max-width: 1919px) {
    width: 90%;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
  @media (min-width: 1920px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }

  @media (min-width: 360px) and (max-width: 765px) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;
  }
`;
