import styled from 'styled-components';

import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const CharCount = styled.span`
  color: ${Label.assistive};
  ${typographyCss(Typography.caption1.regular)}
`;

export default CharCount;
