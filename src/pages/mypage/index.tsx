import { UserAttendance, UserProfile } from '@@types/request';
import { token } from '@utils/state';
import { AxiosError } from 'axios';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getUserAttendance, getUserProfile } from 'src/apis/account';
import NameCard from '@mypage/component/NameCard';
import styled from 'styled-components';
import MyAttendanceSection from '@mypage/MyAttendanceSection';
import ProfileCard from '@mypage/component/ProfileCard';
import { GreyScale } from '@utils/constant/color';
import { useRouter } from 'next/router';

const MyPage = () => {
  const tokenState = useRecoilValue(token);
  const router = useRouter();
  useEffect(() => {
    if (!tokenState.access) {
      router.push('/login');
    }
  }, []);
  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<UserProfile, AxiosError>(['userProfile', tokenState], () => getUserProfile(tokenState));

  const {
    data: userAttendance,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useQuery<UserAttendance, AxiosError>(
    ['userAttendance', userProfile?.name],
    () => getUserAttendance(userProfile!.name),
    {
      enabled: !!userProfile,
    },
  );
  console.log(userProfile);
  return (
    <>
      {userProfile && userAttendance && (
        <Wrapper>
          <Header>
            <NameCard name={userProfile.name} generation={userProfile?.generation} />
          </Header>
          <RowWrapper>
            <ProfileCard user={userProfile} />
            <MyAttendanceSection userAttendance={userAttendance} />
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
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 1.6rem;
  color: ${GreyScale.default};
`;

const RowWrapper = styled.div`
  margin-top: 5rem;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 35px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;
