import { IProjectDetail } from '@@types/request';
import React from 'react';
import { useQuery } from 'react-query';
import { getProjectDetail } from 'src/apis/projectDeatil';
import ProjectIntroduction from './ProjectIntroductionSection';
import TeamIntroducton from './TeamIntroductonSection';
import styled from 'styled-components';
import { GreyScale } from '@utils/constant/color';

const DetailMainSection = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery<IProjectDetail>(['projectDeatil', id], () => getProjectDetail(id));
  console.log(data);
  if (data)
    return (
      <Wrapper>
        <FlexBox>
          <TeamIntroducton projectData={data} />
          <ProjectIntroduction projectData={data} />
        </FlexBox>
        <hr />
      </Wrapper>
    );
  return <div></div>;
};

export default DetailMainSection;
const FlexBox = styled.div`
  display: flex;
  gap: 32px;
  margin: 30px 0;
`;
const Wrapper = styled.div`
  width: 100%;
  &hr {
    background: ${GreyScale.light};
  }
`;
