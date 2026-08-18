import { ReactNode } from 'react';
import styled from 'styled-components';

import { Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface PageHeaderProps {
  className?: string;
  title: string;
  subtitle: ReactNode;
  align?: 'left' | 'center';
}

const PageHeader = ({ className, title, subtitle, align = 'left' }: PageHeaderProps) => {
  return (
    <Wrapper className={className} $align={align}>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Wrapper>
  );
};

export default PageHeader;

const Wrapper = styled.div<{ $align: 'left' | 'center' }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$align === 'center' ? 'center' : 'flex-start')};
  text-align: ${(props) => (props.$align === 'center' ? 'center' : 'left')};
  padding-top: 80px;
`;

const Title = styled.p`
  margin: 0;
  width: 100%;
  color: ${Orange.o500};
  ${typographyCss(Typography.display2.bold)}

  ${media.xs} {
    ${typographyCss(Typography.title2.bold)}
  }
`;

const Subtitle = styled.p`
  margin: 0;
  width: 100%;
  color: ${Orange.o500};
  ${typographyCss(Typography.heading2.medium)}
`;
