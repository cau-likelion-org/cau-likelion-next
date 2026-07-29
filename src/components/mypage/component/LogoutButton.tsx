import React from 'react';
import { AiOutlinePoweroff } from 'react-icons/ai';
import styled from 'styled-components';
import { BackgroundColor } from '@utils/constant/color';
import useTokenStore from 'src/store/useTokenStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const LogoutButton = () => {
  const router = useRouter();
  const setToken = useTokenStore((state) => state.setToken);
  const queryClient = useQueryClient();
  const handleLogout = () => {
    setToken({
      access: null,
      refresh: null,
    });
    queryClient.clear();
  };

  return (
    <Wrapper>
      <ButtonWrapper onClick={handleLogout}>
        <Text>로그아웃</Text>
        <AiOutlinePoweroff size={13} />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default LogoutButton;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: flex-start;
`;

const ButtonWrapper = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  color: ${BackgroundColor};
  background-color: #333333;
  border-radius: 50px;
  padding: 3px 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
`;

const Text = styled.div``;
