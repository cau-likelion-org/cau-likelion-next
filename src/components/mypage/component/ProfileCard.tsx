import { UserProfile } from '@@types/request';
import { TRACK_NAME } from '@utils/constant';
import { BackgroundColor, Basic, GreyScale, Primary } from '@utils/constant/color';
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
            {user &&
                <Wrapper>
                    <NameRow>
                        <BlueText>{user.name}</BlueText>
                        <UserEditButton onClick={handleUserEditModal}>개인정보 변경</UserEditButton>
                    </NameRow>
                    <DescriptionWrapper>
                        <DescriptionRow>
                            <BlueText>{user.generation}기</BlueText>
                            <Text>{user.isAdmin ? '운영진' : '아기사자'}</Text>
                        </DescriptionRow>
                        <DescriptionRow>
                            <BlueText>트랙</BlueText>
                            <Text>{TRACK_NAME[user.track]}</Text>
                        </DescriptionRow>
                    </DescriptionWrapper>
                </Wrapper>
            }
            {isEditModalOn ? <UserEditModal userProfile={user} isEditModalOn={isEditModalOn} handleUserEditModal={handleUserEditModal} /> : null}
        </>
    );
};

export default ProfileCard;

const Wrapper = styled.div`
    width: 180px;
    height: 140px;
    padding: 2rem;
    background-color: ${Primary.light};
    border-radius: 10px;
    display: flex;
    flex-direction: column;

    @media(max-width: 900px){
        width: 90%;
        height: 200px;
    }
`;

const NameRow = styled.div`
    display: flex;
    border-bottom: 1px solid #E2E4FF;
    width: 100%;
    justify-content: space-between;
    padding: 1rem 0;
`;

const DescriptionRow = styled.div`
    display: flex;
    gap: 8px;
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
    background-color: #FEFEFE;
    border-radius: 50px;
    padding: 2px 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
`;

