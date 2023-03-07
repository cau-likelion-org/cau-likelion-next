import { UserProfile } from '@@types/request';
import { TRACK_NAME } from '@utils/constant';
import { Basic, GreyScale, Primary } from '@utils/constant/color';
import { checkGeneration } from '@utils/index';
import React, { useState } from 'react';
import styled from 'styled-components';
import UserEditModal from './UserEditModal';

const ProfileCard = ({ user }: { user: UserProfile; }) => {
  const [isEditModalOn, setIsEditModalOn] = useState(false);

  const handleUserEditModal = () => {
    setIsEditModalOn(!isEditModalOn);
  };

  return (
    <>
      {user && (
        <Wrapper>
          <NameRow>
            <BlueText>{user.name}</BlueText>
            <UserEditButton onClick={handleUserEditModal}>개인정보 변경</UserEditButton>
          </NameRow>
          <DescriptionWrapper>
            <DescriptionRow>
              <BlueText>{user.generation}기</BlueText>
              <Text>{user.is_admin ? '운영진' : checkGeneration(user.generation) ? '아기사자' : '어른사자'}</Text>
            </DescriptionRow>
            <DescriptionRow>
              <BlueText>트랙</BlueText>
              <Text>{user.track == 4 ? '운영팀' : TRACK_NAME[user.track]}</Text>
            </DescriptionRow>
          </DescriptionWrapper>
        </Wrapper>
      )}
      {isEditModalOn ? (
        <UserEditModal userProfile={user} isEditModalOn={isEditModalOn} handleUserEditModal={handleUserEditModal} />
      ) : null}
    </>
  );
};

export default ProfileCard;

const Wrapper = styled.div`
    width: 50%;
    height: 140px;
    padding: 2rem;
    background-color: ${Primary.light};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    @media(min-width: 900px){
        width: 200px;
        height: 200px;
    }
`;

const NameRow = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e4ff;
  width: 100%;
  justify-content: space-between;
  padding: 1rem 0;
`;

const DescriptionRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Text = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.5rem;
  color: ${Basic.default};
`;
const BlueText = styled(Text)`
  font-weight: 700;
  color: ${Primary.default};
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  gap: 8px;
`;

const UserEditButton = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  color: ${GreyScale.default};
  background-color: #fefefe;
  border-radius: 50px;
  padding: 2px 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
