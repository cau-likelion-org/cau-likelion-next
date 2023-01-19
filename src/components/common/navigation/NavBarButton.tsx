import React from 'react';
import styled from 'styled-components';
interface INavBarButton {
  title: string;
  routing: string;
}

const NavBarButton = ({ title, routing }: INavBarButton) => {
  if (title === '로그인') return <LoginButton>{title}</LoginButton>;
  return <Button>{title}</Button>;
};

export default NavBarButton;

const Button = styled.button`
  background: none;
  padding: 0 2%;
  border: none;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  text-align: center;
`;

const LoginButton = styled(Button)`
  border-radius: 3.25rem;
  background-color: #333333;
  color: white;
  padding: 11px 31px;
`;
