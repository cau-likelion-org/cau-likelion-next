import styled from 'styled-components';

import PageHeader from '@common/pageHeader/PageHeader';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

const RecruitPageHeader = styled(PageHeader)`
  word-break: keep-all;

  ${media.xs} {
    gap: 22px;
    padding-top: 44px;

    p:first-child {
      ${typographyCss(Typography.title2.bold)}
    }

    p:last-child {
      ${typographyCss(Typography.headline1.medium)}
    }
  }
`;

export default RecruitPageHeader;
