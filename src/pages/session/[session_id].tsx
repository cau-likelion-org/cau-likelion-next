import SessionDetailSection from '@session/SessionDetailSection';
import {ReactElement} from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import {useQuery} from 'react-query';
import { ISessionDetail } from '@@types/request';
import Carousel from '@archiving/Carousel';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import { getSessionDetail } from 'src/apis/sessionDetail';
import { GetStaticPaths } from 'next';
import { GreyScale } from '@utils/constant/color';

const SessionDetail = ({sessionDetailStaticData}:{sessionDetailStaticData:ISessionDetail;}) => {
    const router = useRouter();
    const {data, isLoading} = useQuery<ISessionDetail>(['sessionDetail', router.query.project_id], ()=>
        getSessionDetail(router.query.session_id as string),
        )

    return (
        <Wrapper>
            <Carousel images={isLoading ? sessionDetailStaticData.thumbnail : data!.thumbnail}/>
            <SessionDetailSection sessionDetail={sessionDetailStaticData}/>
            <hr/>
        </Wrapper>
    );
};

SessionDetail.getLayout = function getLayout(page:ReactElement){
    return <LayoutArchiving>{page}</LayoutArchiving>;
};

export const getStaticPaths: GetStaticPaths = (async) => {
    return {
        paths: [{ params: { session_id: '8' } }],
        fallback: true,
    };
};

export async function getStaticProps({ params }: { params: { session_id: string; }; }) {
    const sessionDeatilStaticData = await getSessionDetail(params.session_id);
    return {
        props: {
            sessionDetailStaticData: sessionDeatilStaticData,
        },
        revalidate: 86400,
    };
}


export default SessionDetail;


const Wrapper=styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    &hr {
        background: ${GreyScale.light};
    }
    
`