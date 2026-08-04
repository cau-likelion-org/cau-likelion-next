import styled from 'styled-components';

import PageHeader from '@common/pageHeader/PageHeader';

const AboutHero = () => {
  return (
    <Wrapper
      align="center"
      title="중앙대학교 멋쟁이사자처럼"
      subtitle={
        <>
          중앙대 멋사 간략한 소개글 두줄 정도 중앙대 멋사 간략한 소개글 두줄 정도 중앙대 멋사 간략한
          <br />
          중앙대 멋사 간략한 소개글 두줄 정도 중앙대 멋사 간략한 소개글 두줄 정도
        </>
      }
    />
  );
};

export default AboutHero;

const Wrapper = styled(PageHeader)`
  gap: 32px;
  padding-bottom: 80px;
  padding-left: 20px;
  padding-right: 20px;
`;
