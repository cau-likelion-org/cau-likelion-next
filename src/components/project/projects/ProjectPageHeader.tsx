import styled from 'styled-components';

import PageHeader from '@common/pageHeader/PageHeader';

const ProjectPageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return <Wrapper title={title} subtitle={subtitle} />;
};

export default ProjectPageHeader;

const Wrapper = styled(PageHeader)`
  width: 1060px;
  max-width: 100%;
  gap: 24px;
  padding-bottom: 52px;

  @media (max-width: 900px) {
    padding-bottom: 32px;
  }
`;
