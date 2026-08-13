import styled from 'styled-components';

import { IcPlus } from '@assets/svg';
import { Fill, Label } from '@utils/constant/color';

const AddCardButton = ({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) => {
  return (
    <Wrapper type="button" onClick={onClick} aria-label={ariaLabel}>
      <IcPlus width={20} height={20} />
    </Wrapper>
  );
};

export default AddCardButton;

const Wrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 12px;
  background-color: ${Fill.normal};
  color: ${Label.alternative};
  cursor: pointer;
`;
