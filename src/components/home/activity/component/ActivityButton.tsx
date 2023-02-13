import styled from 'styled-components';

import { BackgroundColor, GreyScale, Primary } from '@utils/constant/color';

interface ActivityButtonProps {
  title: string;
  isClicked: boolean;
  handleClickActivityButton: () => void;
}

const ActivityButton = ({ title, isClicked, handleClickActivityButton }: ActivityButtonProps) => {
  return (
    <Button isClicked={isClicked} onClick={handleClickActivityButton}>
      {title}
    </Button>
  );
};

export default ActivityButton;

const Button = styled.div<{ isClicked: boolean; }>`
  color: ${(props) => (props.isClicked ? Primary.default : GreyScale.default)};
  transition: 0.3s ease;
  @media(max-width: 900px){
    flex-basis: 16%;
    border-radius: 20px;
    font-size: 1.5rem;
  }

  @media(max-width: 400px){
    flex-basis: 16%;
    border-radius: 20px;
    font-size: 1rem;
  }
  border-radius: 100px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 2rem;
`;
