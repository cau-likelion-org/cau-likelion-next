import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import SessionSection from '@session/SessionSection';
import { ReactElement } from 'react';
import { TRACK_NAME } from '@utils/constant';
import { getSessions } from 'src/apis/session';
import { ArchivingArrayType, ISessionData } from '@@types/request';
import { useQuery } from 'react-query';

const SessionList = ({ sessionStaticData }: { sessionStaticData: ArchivingArrayType<ISessionData>; }) => {
    const { data, isLoading } = useQuery(['sessionData'], getSessions);

    return (
        <>
            <Header pageName="세션" introduce="중앙대 멋사에서 진행한 세션을 소개합니다!" />
            {Object.values(isLoading ? sessionStaticData : data!).map((data, i) => {
                return (
                    <SessionSection key={i} trackName={TRACK_NAME[i]} trackData={data} />
                );
            })}
        </>
    );
};

SessionList.getLayout = function getLayout(page: ReactElement) {
    return <LayoutArchiving>{page}</LayoutArchiving>;
};

export async function getStaticProps({ params }: { params: { track: string; }; }) {
    const sessionStaticData = await getSessions();
    return {
        props: {
            sessionStaticData,
        },
        revalidate: 86400,
    };
}

export default SessionList;