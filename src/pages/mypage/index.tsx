import { UserProfile } from '@@types/request';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import useProfileChangedStore from 'src/store/useProfileChangedStore';
import { getUserProfile } from 'src/apis/account';
import NameCard from '@mypage/component/NameCard';
import styled from 'styled-components';
import ProfileCard from '@mypage/component/ProfileCard';
import { GreyScale } from '@utils/constant/color';
import { checkGeneration } from '@utils/index';
import MyScoreSection from '@mypage/MyScoreSection';
import TotalScoreSection from '@mypage/TotalScoreSection';
import { useRouter } from 'next/router';

const MyPage = () => {
  const tokenState = useTokenStore((state) => state.token);
  const profileChanged = useProfileChangedStore((state) => state.profileChanged);
  const router = useRouter();

  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile', profileChanged],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  useEffect(() => {
    if (!tokenState.access) router.push('/login');
  }, [tokenState, router]);

  const isActiveGeneration = !!userProfile && checkGeneration(userProfile.generation);
  return (
    <>
      {userProfile && (
        <Wrapper>
          <Header>
            <NameCard name={userProfile.name} generation={userProfile?.generation} />
          </Header>
          <RowWrapper>
            <ProfileCard user={userProfile} />
            {isActiveGeneration ? (
              userProfile.is_admin ? (
                <TotalScoreSection myName={userProfile.name} />
              ) : (
                <MyScoreSection userProfile={userProfile} />
              )
            ) : null}
          </RowWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default MyPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 1.6rem;
  color: ${GreyScale.default};
`;

const RowWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 35px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;
