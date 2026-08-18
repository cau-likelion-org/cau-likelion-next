import styled from 'styled-components';

import PageHeader from '@common/pageHeader/PageHeader';
import { Typography, typographyCss } from '@utils/constant/typography';
import { containerCss } from '@utils/constant/breakpoint';

const ProjectPageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return <Wrapper title={title} subtitle={subtitle} />;
};

export default ProjectPageHeader;

const Wrapper = styled(PageHeader)`
  ${containerCss}
  gap: 24px;
  padding-bottom: 52px;

  @media (max-width: 900px) {
    padding-bottom: 32px;
  }

  @media (max-width: 600px) {
    padding: 52px 20px;

    p:first-of-type {
      ${typographyCss(Typography.display2.bold)}
    }
  }
`;
