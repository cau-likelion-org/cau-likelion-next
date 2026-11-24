import styled from 'styled-components';

import { State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export const RequiredSmall = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.label1Normal.medium)}
`;
