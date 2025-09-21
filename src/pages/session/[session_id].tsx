import SessionDetailSection from '@session/SessionDetailSection';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { ISessionDetail } from '@@types/request';
import Carousel from '@archiving/Carousel';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import { GetStaticPaths } from 'next';
import { GreyScale } from '@utils/constant/color';
import { getSessions } from 'src/apis/session';
import { getPaths } from '@utils/index';
import DetailPageHead from 'src/components/meta/DetailPageHead';
import { ARCHIVING } from '@utils/constant';
import useSessionDetail from 'src/apis/queries/useSessionDetail';

const SessionDetail = ({ sessionDetailStaticData }: { sessionDetailStaticData: ISessionDetail }) => {
  const router = useRouter();
  const { sessionDetail: data, isLoading } = useSessionDetail();
  if (router.isFallback) {
    return <div>로딩중</div>;
  }

  return (
    <>
      <DetailPageHead
        title={data?.title}
        canoUrl={`https://cau-likelion.org/session/${data?.id}`}
        img={data?.thumbnail}
        category={ARCHIVING.SESSION}
        description={data?.subtitle}
      />
      <Wrapper>
        <StCarousel images={isLoading ? sessionDetailStaticData.image : data!.image} />
        <SessionDetailSection sessionDetail={sessionDetailStaticData} />
      </Wrapper>
    </>
  );
};

SessionDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sessionsArray = await getSessions();
  const paths = getPaths(sessionsArray, 'session');
  return {
    paths,
    fallback: true,
  };
};

export async function getStaticProps({ params }: { params: { session_id: string } }) {
  const sessionDeatilStaticData = await getSessionDetail(params.session_id);
  return {
    props: {
      sessionDetailStaticData: sessionDeatilStaticData,
    },
    revalidate: 86400,
  };
}

export default SessionDetail;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  &hr {
    background: ${GreyScale.light};
  }
`;

const StCarousel = styled(Carousel)`
  cursor: pointer;
`;
