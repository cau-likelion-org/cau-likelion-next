import styled from 'styled-components';

import { IcChevronLeftThick } from '@assets/svg';
import { BackgroundColor, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface BackHeaderProps {
  label: string;
  onClick: () => void;
}

const BackHeader = ({ label, onClick }: BackHeaderProps) => (
  <Wrapper>
    <IconButton type="button" onClick={onClick} aria-label={label}>
      <IcChevronLeftThick width={20} height={20} />
    </IconButton>
    <Label>{label}</Label>
  </Wrapper>
);

export default BackHeader;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 32px 0;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background-color: ${BackgroundColor};
  color: ${Orange.o500};
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 96, 0, 0.08);
  }
`;

const Label = styled.span`
  color: ${Orange.o500};
  ${typographyCss(Typography.heading2.bold)}
`;
