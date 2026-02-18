import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import SessionSection from '@session/SessionSection';
import { ReactElement } from 'react';
import { ARCHIVING, TRACK_NAME } from '@utils/constant';
import { getSessions } from 'src/apis/session';
import { ArchivingArrayType, ISessionData } from '@@types/request';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import ListPageHead from 'src/components/meta/ListPageHead';

const SessionList = ({ sessionStaticData }: { sessionStaticData: ArchivingArrayType<ISessionData> }) => {
  const { data } = useQuery(['sessionData'], getSessions);
  const sessionData = data ?? sessionStaticData;

  return (
    <>
      <ListPageHead category={ARCHIVING.SESSION} canoUrl={'https://cau-likelion.org/session'} />
      <Header pageName="세션" introduce="멋사에서 진행한 세션" />
      <Wrapper>
        {Object.values(sessionData).map((trackData, i) => {
          return <SessionSection key={TRACK_NAME[i]} trackName={TRACK_NAME[i]} trackData={trackData} />;
        })}
      </Wrapper>
    </>
  );
};

SessionList.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export async function getStaticProps({ params }: { params: { track: string } }) {
  const sessionStaticData = await getSessions();
  return {
    props: {
      sessionStaticData,
    },
    revalidate: 86400,
  };
}

export default SessionList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem;
`;
