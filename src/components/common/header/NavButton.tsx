import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

interface INavBarButton {
  title: string;
  routing: string;
  target?: string;
}

const NavButton = ({ title, routing, target }: INavBarButton) => {
  if (title === 'Log in' || title === 'MY')
    return (
      <Link href={routing} target={target}>
        <LoginButton>{title}</LoginButton>
      </Link>
    );
  if (target) {
    return (
      <a href={routing} target={target}>
        <Button>{title}</Button>
      </a>
    );
  } else {
    return (
      <Link href={routing} target={target}>
        <Button>{title}</Button>
      </Link>
    );
  }
};

export default NavButton;

const Button = styled.div`
  background: none;
  padding: 1rem 4rem;
  border: none;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 1.5rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const LoginButton = styled(Button)`
  border-radius: 52px;
  background-color: #333333;
  color: white;
  margin: 0 2rem;
  padding: 1rem 2rem;
`;
