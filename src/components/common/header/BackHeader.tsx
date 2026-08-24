import styled from 'styled-components';

import { IcChevronLeftThick } from '@assets/svg';
import { Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

interface BackHeaderProps {
  label: string;
  onClick: () => void;
}

const BackHeader = ({ label, onClick }: BackHeaderProps) => (
  <Wrapper>
    <ClickableRow type="button" onClick={onClick}>
      <IconSlot>
        <IcChevronLeftThick width={20} height={20} />
      </IconSlot>
      <Label>{label}</Label>
    </ClickableRow>
  </Wrapper>
);

export default BackHeader;

const Wrapper = styled.div`
  width: 100%;
  padding: 32px 0;

  ${media.sm} {
    padding: 80px 0 52px;
  }
`;

const ClickableRow = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  cursor: pointer;
`;

const IconSlot = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${Orange.o500};
`;

const Label = styled.span`
  color: ${Orange.o500};
  ${typographyCss(Typography.heading2.bold)}

  ${media.sm} {
    ${typographyCss(Typography.title3.bold)}
  }
`;
