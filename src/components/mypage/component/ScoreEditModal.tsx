import { RequestEditUserScore, UserAttendance, UserProfile, UserScore } from '@@types/request';
import FormSendButton from '@signup/component/FormSendButton';
import { BackgroundColor, Basic, GreyScale } from '@utils/constant/color';
import { IToken, token } from '@utils/state';
import React from 'react';
import { useMutation } from 'react-query';
import { useRecoilValue } from 'recoil';
import { editUserScore } from 'src/apis/mypage';
import useInput from 'src/hooks/useInput';
import styled from 'styled-components';
import { HiXMark } from 'react-icons/hi2';
import { getTotalAttendance } from 'src/apis/mypage';
import { ATTENDANCE_CATEGORY_NAME, TRACK_NAME } from '@utils/constant';

interface ScoreEditModalProps {
    targetUserScore: UserScore;
    isEditModalOn: boolean;
    handleScoreEditModal: (userScore: UserScore) => void;
}

const ScoreEditModal = ({ targetUserScore, isEditModalOn, handleScoreEditModal }: ScoreEditModalProps) => {
    const tokenState = useRecoilValue(token);
    const [truancyValue, onChangeTruancyValue] = useInput(Number(targetUserScore.truancy), /^[0-9]*$/);
    const [tardinessValue, onChangeTardinessValue] = useInput(Number(targetUserScore.tardiness), /^[0-9]*$/);
    const [absenceValue, onChangeAbsenceValue] = useInput(Number(targetUserScore.absence), /^[0-9]*$/);

    const editScore = useMutation({
        mutationFn: ({ userScore, accessToken }: { userScore: RequestEditUserScore; accessToken: IToken; }) => editUserScore(userScore, accessToken),
        onSuccess: (res) => {
            if (res.status === 200) {
                () => getTotalAttendance(tokenState);
            }
        },
    });

    const handleSubmit = () => {
        if (tokenState) {
            editScore.mutate({
                userScore: {
                    user_id: targetUserScore.user_id,
                    truancy: truancyValue,
                    absence: absenceValue,
                    tardiness: tardinessValue
                },
                accessToken: tokenState
            });
        }
        handleScoreEditModal(targetUserScore);
    };

    return (
        <Layer>
            <Wrapper>
                <Header>
                    <Title>출결사항 수정
                        <span>[{TRACK_NAME[targetUserScore.track]}] {targetUserScore.name}</span>
                    </Title>
                    <MenuButton onClick={() => handleScoreEditModal(targetUserScore)} >
                        <HiXMark size={25} />
                    </MenuButton>
                </Header>
                <FormWrapper>
                    <ScoreWrapper>
                        <ScoreRow>
                            {Array.from({ length: 5 }, (_, i) => (
                                <ScoreTitle index={i} key={i}>{ATTENDANCE_CATEGORY_NAME[i]}</ScoreTitle>
                            ))}
                        </ScoreRow>
                        <ScoreRow>
                            <Score>
                                <ScoreInput
                                    value={absenceValue}
                                    onChange={onChangeAbsenceValue} />
                            </Score>
                            <Score>
                                <ScoreInput
                                    value={truancyValue}
                                    onChange={onChangeTruancyValue} />
                            </Score>
                            <Score>
                                <ScoreInput
                                    value={tardinessValue}
                                    onChange={onChangeTardinessValue} />
                            </Score>
                            <Score>{targetUserScore.notSubmitted}</Score>
                            <Score border={false}>{targetUserScore.lateSubmitted}</Score>
                        </ScoreRow>
                    </ScoreWrapper>
                    <FormSendButton isActive={true} handleSubmit={handleSubmit} buttonTitle={'수정하기'} />
                </FormWrapper>
            </Wrapper>
        </Layer >
    );
};

export default ScoreEditModal;

const Layer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10000;
`;

const Title = styled.div`
    &>span {
        font-size: 1.5rem;
        font-weight: 500;
        margin-left: 10px;
        text-align: center;
    }
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
`;

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
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


const ScoreWrapper = styled.div`
    margin: 3rem 0;
    width: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    border: 1px solid #BBBBBB;
    justify-content: space-between;
    overflow: hidden;
`;

const ScoreRow = styled.div`
    display: flex;
    width: 100%;
`;

const ScoreInput = styled.input`
    font-family: 'Pretendard';
    padding: 0.8rem 0;
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    flex-basis: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FEFEFE;
    border: 0.5px solid gray;
    padding: 0.5rem;
`;

const ScoreTitle = styled.div<{ index: number; }>`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    flex-basis: 50%;
    padding: 1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${GreyScale.light};
    border-right: ${props => props.index == 4 ? 'none' : '1px solid gray'};
`;

const Score = styled.div<{ border?: boolean; }>`
    font-family: 'Pretendard';
    padding: 0.8rem 0;
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    flex-basis: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FEFEFE;
    border-right: ${props => props.border == false ? 'none' : '1px solid gray'};
`;