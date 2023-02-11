import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import SessionSection from '@session/SessionSection';
import { InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { getSessions } from 'src/apis/session';
import { SessionsArrayType } from '@@types/request';
import { useQuery } from 'react-query';

const SessionList = () => {
    const { data, isLoading } = useQuery<SessionsArrayType>(['sessions'], getSessions);

    return (
    <>
        <Header pageName="세션" introduce="중앙대 멋사에서 진행한 세션을 소개합니다!" />
    
        {/* {Object.entries(isLoading ? staticData : (data as SessionsArrayType))!.map(([track, value])=>( */}
            
                <SessionSection track='기획' link={'/pm'} />


            
        {/* ))} */}




        
        {/* <ProjectsSection staticData={projectStaticData} /> */}
    </>
    );
};

SessionList.getLayout = function getLayout(page: ReactElement) {
    return <LayoutArchiving>{page}</LayoutArchiving>;
};

// export async function getStaticProps() {
//     const projectStaticData = await getProjects();
//     return {
//     props: {
//         projectStaticData,
//     },
//     revalidate: 86400,
// };
// }
export default SessionList;
