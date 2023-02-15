import styled from 'styled-components';

import { BackgroundColor, GreyScale, Primary } from '@utils/constant/color';
interface TrackButtonProps {
  title: string;
  isClicked: boolean;
  handleClickTrackButton: () => void;
}

const TrackButton = ({ title, isClicked, handleClickTrackButton }: TrackButtonProps) => {
  return (
    <Button isClicked={isClicked} onClick={handleClickTrackButton}>
      {title}
    </Button>
  );
};

export default TrackButton;

const Button = styled.div<{ isClicked: boolean }>`
  background-color: ${(props) => (props.isClicked ? Primary.default : GreyScale.light)};
  transition: 0.3s ease;
  @media (max-width: 900px) {
    flex-basis: 25%;
    padding: 2rem 1rem;
    border-radius: 20px;
    height: 35px;
    font-size: 10px;
  }
  width: 250px;
  height: 68px;
  border-radius: 100px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 1.7rem;
  color: ${(props) => (props.isClicked ? BackgroundColor : 'black')};
`;
