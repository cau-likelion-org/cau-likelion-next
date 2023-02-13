import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import SessionSection from '@session/SessionSection';
import { ReactElement } from 'react';
import { TRACK_NAME } from '@utils/constant';


const SessionList = () => {
    
    return (
        <>
        <Header pageName="세션" introduce="중앙대 멋사에서 진행한 세션을 소개합니다!" />

        {Object.entries(TRACK_NAME).map((idx)=>{
            return(<SessionSection key={idx[0]} track={idx[1]} />)
        })}

        </>
);
        

        
};

SessionList.getLayout = function getLayout(page: ReactElement) {
    return <LayoutArchiving>{page}</LayoutArchiving>;
};

export default SessionList;
