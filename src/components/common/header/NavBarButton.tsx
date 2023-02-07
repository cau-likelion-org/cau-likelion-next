import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
interface INavBarButton {
  title: string;
  routing: string;
}

const NavBarButton = ({ title, routing }: INavBarButton) => {
  if (title === 'Log in' || title === 'MY')
    return (
      <Link href={routing}>
        <LoginButton>{title}</LoginButton>
      </Link>
    );

  return (
    <Link href={routing}>
      <Button>{title}</Button>
    </Link>
  );
};

export default NavBarButton;

const Button = styled.div`
  background: none;
  margin: 0 2%;
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
  padding: 11px 28px;
`;
