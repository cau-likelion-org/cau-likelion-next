import { useId, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@tanstack/react-query';

import Button from '@common/button/Button';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import TextField from '@common/textField/TextField';
import { IcKakaotalk } from '@assets/svg';
import useFocusTrap from 'src/hooks/useFocusTrap';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { getAvailableParts, subscribeRecruitment } from 'src/apis/recruitment';
import useRecruitModalStore from 'src/store/useRecruitModalStore';
import { isUnfilled } from '@utils/index';
import { BackgroundColor, Fill, Label, Material } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_HMPxfG';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RecruitNotifyModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);
  const closeWithToast = useRecruitModalStore((state) => state.closeWithToast);

  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);

  const { data: availableParts } = useQuery({
    queryKey: ['recruitment-available-parts'],
    queryFn: getAvailableParts,
  });
  const departmentOptions = useMemo(() => availableParts?.map((part) => part.name) ?? [], [availableParts]);
  const selectedPart = useMemo(
    () => availableParts?.find((part) => part.name === department),
    [availableParts, department],
  );

  const {
    listId: departmentListId,
    wrapperRef: departmentSelectRef,
    triggerRef: departmentTriggerRef,
    activeIndex: activeDepartmentIndex,
    handleKeyDown: handleDepartmentKeyDown,
    handleBlur: handleDepartmentBlur,
    selectOption: selectDepartment,
  } = useListboxSelect({
    isOpen: isDepartmentOpen,
    options: departmentOptions,
    value: department,
    onOpen: () => setIsDepartmentOpen(true),
    onClose: () => setIsDepartmentOpen(false),
    onSelect: setDepartment,
  });

  const isEmailInvalid = showEmailError && !EMAIL_REGEX.test(email);
  const isValid = !isUnfilled(name) && !!selectedPart && !isUnfilled(email);

  const subscribeMutation = useMutation({
    mutationFn: subscribeRecruitment,
    onSuccess: () => {
      closeWithToast('positive', '사전 알림 신청이 완료되었습니다.');
    },
    onError: () => {
      closeWithToast('negative', '알림 신청에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const handleSubmit = () => {
    if (!isValid || !selectedPart) return;
    if (!EMAIL_REGEX.test(email)) {
      setShowEmailError(true);
      return;
    }
    subscribeMutation.mutate({ email, name, interestPartIds: [selectedPart.id] });
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
            <SelectWrapper
              ref={departmentSelectRef}
              onKeyDownCapture={handleDepartmentKeyDown}
              onBlur={handleDepartmentBlur}
            >
              <Select
                ref={departmentTriggerRef}
                heading="관심파트"
                required
                placeholder="선택"
                value={department}
                onClick={() => setIsDepartmentOpen((prev) => !prev)}
                aria-expanded={isDepartmentOpen}
                aria-activedescendant={isDepartmentOpen ? `${departmentListId}-${activeDepartmentIndex}` : undefined}
                aria-controls={departmentListId}
              />
              {isDepartmentOpen && (
                <ListboxOptions
                  listId={departmentListId}
                  options={departmentOptions}
                  value={department}
                  activeIndex={activeDepartmentIndex}
                  onSelect={selectDepartment}
                />
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
            <Button
              variant="solid"
              color="primary"
              size="large"
              disabled={!isValid}
              loading={subscribeMutation.isPending}
              onClick={handleSubmit}
            >
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
