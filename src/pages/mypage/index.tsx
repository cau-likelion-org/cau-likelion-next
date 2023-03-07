import { UserProfile } from '@@types/request';
import { token, userProfileChanged } from '@utils/state';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
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
  const tokenState = useRecoilValue(token);
  const [isActiveGeneration, setIsActiveGeneration] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const profileChanged = useRecoilValue(userProfileChanged);
  const router = useRouter();

  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<UserProfile, AxiosError>(['userProfile', profileChanged], () => getUserProfile(tokenState), {
    enabled: !!tokenState.access,
  });

  useEffect(() => {
    if (tokenState.access) setIsLogin(true);
    else {
      setIsLogin(false);
      router.push('/login');
    }
  }, [tokenState]);

  useEffect(() => {
    if (userProfile && checkGeneration(userProfile.generation)) {
      setIsActiveGeneration(true);
    } else {
      setIsActiveGeneration(false);
    }
  }, [userProfile]);

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
                <TotalScoreSection />
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
