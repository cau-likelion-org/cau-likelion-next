import styled from 'styled-components';

import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const CharCount = styled.span`
  padding: 0 4px;
  opacity: 0.74;
  color: ${Label.alternative};
  ${typographyCss(Typography.label2.regular)}
`;

export default CharCount;
