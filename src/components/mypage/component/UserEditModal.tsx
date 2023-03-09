import { UserProfile } from '@@types/request';
import DropdownMenuBox from '@signup/component/DropdownMenuBox';
import FormSendButton from '@signup/component/FormSendButton';
import TextInputBox from '@signup/component/TextInputBox';
import ToggleBox from '@signup/component/ToggleBox';
import { TRACK, TRACK_INDEX, TRACK_NAME } from '@utils/constant';
import { BackgroundColor, Basic } from '@utils/constant/color';
import { isEmptyString } from '@utils/index';
import { IToken, token, userProfileChanged } from '@utils/state';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import useInput from 'src/hooks/useInput';
import styled from 'styled-components';
import { HiXMark } from 'react-icons/hi2';
import { putUserProfile } from 'src/apis/account';

interface UserEditModalProps {
  userProfile: UserProfile;
  isEditModalOn: boolean;
  handleUserEditModal: () => void;
}

const UserEditModal = ({ userProfile, isEditModalOn, handleUserEditModal }: UserEditModalProps) => {
  const track = [TRACK_NAME[TRACK.PM], TRACK_NAME[TRACK.DESIGN], TRACK_NAME[TRACK.FRONTEND], TRACK_NAME[TRACK.BACKEND], TRACK_NAME[TRACK.ETC]];
  const [nameValue, onChangeName] = useInput(userProfile.name);
  const [profileChanged, setProfileChanged] = useRecoilState(userProfileChanged);
  const [generationValue, onChangeGeneration] = useInput(String(userProfile.generation), /^[0-9]*$/);
  const [toggleIsClicked, setToggleIsClicked] = useState(userProfile.is_admin ? [false, true] : [true, false]);
  const [dropdownValue, setDropdownValue] = useState(track[userProfile.track]);
  const [isFormActivated, setIsFormActivated] = useState(false);
  const tokenState = useRecoilValue(token);

  useEffect(() => {
    if (!isEmptyString(nameValue) && !isEmptyString(generationValue)) setIsFormActivated(true);
    else setIsFormActivated(false);
  }, [nameValue, generationValue, isEditModalOn]);

  const editUserProfile = useMutation({
    mutationFn: ({ userProfile, tokenState }: { userProfile: UserProfile; tokenState: IToken; }) =>
      putUserProfile({ form: userProfile, accessToken: tokenState.access, refreshToken: tokenState.refresh }),
    onSuccess: (res) => {
      if (res.message === 'success') {
        setProfileChanged(!profileChanged);
      }
    },
  });

  const handleSubmit = () => {
    if (isFormActivated && tokenState.access) {
      editUserProfile.mutate({
        userProfile: {
          name: nameValue,
          generation: Number(generationValue),
          track: TRACK_INDEX[dropdownValue],
          is_admin: toggleIsClicked[1],
        },
        tokenState,
      });
    }
    handleUserEditModal();
  };

  return (
    <Layer>
      <Wrapper>
        <Header>
          <Title>회원정보 변경</Title>
          <MenuButton onClick={handleUserEditModal}>
            <HiXMark size={25} />
          </MenuButton>
        </Header>
        <FormWrapper>
          <TextInputBox
            title={'이름'}
            description={'실명으로 입력해주세요.'}
            placeholder={''}
            value={nameValue}
            onChange={onChangeName}
          />
          <TextInputBox
            title={'기수'}
            description={'마지막 활동 기수를 숫자로 입력해주세요.'}
            placeholder={''}
            value={generationValue}
            onChange={onChangeGeneration}
          />
          <DropdownMenuBox
            title={'파트'}
            menu={track}
            description={'트랙을 선택해주세요'}
            selectedMenu={dropdownValue}
            setSelectedMenu={setDropdownValue}
          />
          <ToggleBox
            title={'일반회원/운영진'}
            toggle={toggleIsClicked}
            setToggle={setToggleIsClicked}
            description={'현 기수 운영진을 제외한 이전 기수 운영진과 기타 회원은 일반회원을 선택해 주세요.'}
          />
          <FormSendButton isActive={isFormActivated} handleSubmit={handleSubmit} buttonTitle={'변경하기'} />
        </FormWrapper>
      </Wrapper>
    </Layer>
  );
};

export default UserEditModal;

const Layer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  overflow: hidden;
`;

const Title = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 800;
  font-size: 2.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 70%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background-color: ${BackgroundColor};
  border-radius: 1rem;
  box-shadow: 10px 10px 30px 0px #00000014;
  padding: 2rem 5rem;
  z-index: 10001;

  @media (max-width: 900px){
    width: 100%;
    height: 100vh;
    border-radius: 0;


  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 1px solid ${Basic.default};
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
`;

const MenuButton = styled.div`
  cursor: pointer;
`;
