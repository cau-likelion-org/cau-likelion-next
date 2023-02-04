import styled from 'styled-components';
import Link from 'next/link';

import { SlArrowRight } from 'react-icons/sl';

import { BackgroundColor, GreyScale, Primary } from '@utils/constant/color';

const ProjectButton = () => {
  return (
    <Link href="/project">
      <ButtonWrapper>
        프로젝트 보러가기
        <SlArrowRight />
      </ButtonWrapper>
    </Link>
  );
};

export default ProjectButton;

const ButtonWrapper = styled.div`
  &:hover {
    background-color: ${Primary.default};
    color: ${BackgroundColor};
  }
  .p {
    line-height: 0;
  }
  margin: 80px 0;
  cursor: pointer;
  background-color: ${GreyScale.light};
  color: black;
  padding: 26px 50px;
  border-radius: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-size: 2rem;
  gap: 10px;
`;
