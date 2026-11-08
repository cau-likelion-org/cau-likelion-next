import { css } from 'styled-components';

import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 지원서 입력칸 제목은 공통 입력 컴포넌트보다 큰 Heading 1 크기를 쓴다
export const applyFieldHeadingCss = css`
  label {
    color: ${Black.b900};
    ${typographyCss(Typography.heading1.bold)}
  }
`;
