import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { track, getDeviceType } from 'src/lib/amplitude';

interface INavBarButton {
  title: string;
  routing: string;
  target?: string;
  isLogin?: boolean;
}

const NavButton = ({ title, routing, target, isLogin }: INavBarButton) => {
  const handleClick = () => {
    track('GNB Tab Clicked', {
      tab_name: title,
      is_external: !!target,
      is_logged_in: !!isLogin,
      device_type: getDeviceType(),
    });
  };

  if (title === 'Log in' || title === 'MY')
    return (
      <Link href={routing}>
        <LoginButton onClick={handleClick}>{title}</LoginButton>
      </Link>
    );

  return target ? (
    <a href={routing} target={target} onClick={handleClick}>
      <Button>{title}</Button>
    </a>
  ) : (
    <Link href={routing}>
      <Button onClick={handleClick}>{title}</Button>
    </Link>
  );
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
