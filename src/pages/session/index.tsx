import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import SessionSection from '@session/SessionSection';
import { ReactElement } from 'react';
import { ARCHIVING, TRACK_NAME } from '@utils/constant';
import { ArchivingArrayType, ISessionData } from '@@types/request';
import styled from 'styled-components';
import ListPageHead from 'src/components/meta/ListPageHead';
import useSessions from 'src/apis/queries/useSessions';
import { getSessions } from 'src/apis/session';

const SessionList = ({ sessionStaticData }: { sessionStaticData: ArchivingArrayType<ISessionData> }) => {
  const { sessions: data, isLoading } = useSessions();

  return (
    <>
      <ListPageHead category={ARCHIVING.SESSION} canoUrl={'https://cau-likelion.org/session'} />
      <Header pageName="세션" introduce="멋사에서 진행한 세션" />
      <Wrapper>
        {Object.values(isLoading ? sessionStaticData : data!).map((data, i) => {
          return <SessionSection key={i} trackName={TRACK_NAME[i]} trackData={data} />;
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
