import { useId, useRef, useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Select from '@common/select/Select';
import TextField from '@common/textField/TextField';
import { IcKakaotalk } from '@assets/svg';
import useFocusTrap from 'src/hooks/useFocusTrap';
import useOutsideClick from 'src/hooks/useOutsideClick';
import { TRACK, TRACK_NAME } from '@utils/constant';
import { BackgroundColor, Fill, Label, Material } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_HMPxfG';
const DEPARTMENT_OPTIONS = [TRACK_NAME[TRACK.PM_DESIGN], TRACK_NAME[TRACK.FRONTEND], TRACK_NAME[TRACK.BACKEND]];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RecruitNotifyModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);

  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);

  const departmentSelectRef = useRef<HTMLDivElement>(null);
  useOutsideClick(departmentSelectRef, () => setIsDepartmentOpen(false), isDepartmentOpen);

  const isEmailInvalid = showEmailError && !EMAIL_REGEX.test(email);
  const isValid = name.trim() !== '' && department !== '' && email.trim() !== '';

  const handleSubmit = () => {
    if (!isValid) return;
    if (!EMAIL_REGEX.test(email)) {
      setShowEmailError(true);
      return;
    }
    onClose();
  };

  return (
    <Backdrop onClick={onClose}>
      <Modal
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <Information>
          <Title id={titleId}>다음 기수 모집 알림받기</Title>
          <Subtitle>리크루팅 페이지가 열리면 가장 먼저 알려드릴게요.</Subtitle>
          <Row>
            <FieldWrapper>
              <TextField
                heading="이름"
                required
                placeholder="이름 입력"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FieldWrapper>
            <SelectWrapper ref={departmentSelectRef}>
              <Select
                heading="관심파트"
                required
                placeholder="선택"
                value={department}
                onClick={() => setIsDepartmentOpen((prev) => !prev)}
                aria-expanded={isDepartmentOpen}
              />
              {isDepartmentOpen && (
                <OptionList role="listbox">
                  {DEPARTMENT_OPTIONS.map((option) => (
                    <Option
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={department === option}
                      onClick={() => {
                        setDepartment(option);
                        setIsDepartmentOpen(false);
                      }}
                    >
                      {option}
                    </Option>
                  ))}
                </OptionList>
              )}
            </SelectWrapper>
          </Row>
          <TextField
            type="email"
            heading="알림 받을 이메일"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            status={isEmailInvalid ? 'negative' : 'normal'}
            description={isEmailInvalid ? '이메일 형식이 맞지 않습니다' : undefined}
          />
        </Information>
        <Actions>
          <Consent>이메일을 통한 모집 알림 수신에 동의합니다. (필수)</Consent>
          <ActionRow>
            <Button variant="outlined" color="assistive" size="large" onClick={onClose}>
              취소
            </Button>
            <Button variant="solid" color="primary" size="large" disabled={!isValid} onClick={handleSubmit}>
              알림 신청하기
            </Button>
          </ActionRow>
          <Promo>
            <PromoText>
              멋쟁이사자처럼 중앙대 공식 카카오톡 채널을 추가하면
              <br />
              소식을 더 빠르게 받아볼 수 있어요.
            </PromoText>
            <Button
              variant="solid"
              color="assistive"
              size="medium"
              trailingIcon={<IcKakaotalk width={16} height={16} />}
              onClick={() => window.open(KAKAO_CHANNEL_URL, '_blank', 'noopener noreferrer')}
            >
              카카오톡 채널 바로가기
            </Button>
          </Promo>
        </Actions>
      </Modal>
    </Backdrop>
  );
};

export default RecruitNotifyModal;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Material.dimmer};
  z-index: 9999;
`;

const Modal = styled.div`
  width: 400px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  background-color: ${BackgroundColor};
  overflow: hidden;
  outline: none;
  z-index: 10000;
`;

const Information = styled.div`
  width: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
`;

const Title = styled.p`
  ${typographyCss(Typography.heading2.bold)}
  color: ${Label.normal};
  text-align: center;
  margin: 0;
`;

const Subtitle = styled.p`
  ${typographyCss(Typography.body2Normal.regular)}
  color: ${Label.alternative};
  text-align: center;
  margin: 0;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const FieldWrapper = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

const SelectWrapper = styled.div`
  position: relative;
  flex: 1 0 0;
  min-width: 0;
`;

const OptionList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 12px;
  background-color: ${BackgroundColor};
  box-shadow:
    0px 10px 15px -3px rgba(23, 23, 23, 0.07),
    0px 4px 6px -2px rgba(23, 23, 23, 0.07);
  z-index: 1;
`;

const Option = styled.button`
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: none;
  text-align: left;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.regular)}

  &:hover {
    background-color: ${Fill.subtle};
  }
`;

const Actions = styled.div`
  width: 100%;
  padding: 0 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Consent = styled.p`
  ${typographyCss(Typography.label2.regular)}
  color: ${Label.alternative};
  text-align: center;
  margin: 0;
`;

const ActionRow = styled.div`
  width: 100%;
  padding: 12px 0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Promo = styled.div`
  width: 100%;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  border-radius: 8px;
  background-color: ${Fill.subtle};
`;

const PromoText = styled.p`
  ${typographyCss(Typography.label2.regular)}
  color: ${Label.alternative};
  text-align: center;
  margin: 0;
`;
