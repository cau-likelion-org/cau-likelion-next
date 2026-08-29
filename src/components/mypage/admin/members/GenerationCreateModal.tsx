import { useState } from 'react';
import styled from 'styled-components';

import { GenerationCreateRequestDto } from '@@types/request';
import TextField from '@common/textField/TextField';
import Button from '@common/button/Button';
import ScrollArea from '@common/scrollArea/ScrollArea';
import TechStackInput from '@mypage/admin/component/TechStackInput';
import useScrollLock from 'src/hooks/useScrollLock';
import { NUMERIC_ONLY_REGEX } from '@utils/constant';
import { isUnfilled } from '@utils/index';
import { BackgroundWhite, Label, Material, State, Status } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface GenerationCreateModalProps {
  onClose: () => void;
  onSubmit: (form: GenerationCreateRequestDto) => void | Promise<unknown>;
  isSubmitting?: boolean;
}

const GenerationCreateModal = ({ onClose, onSubmit, isSubmitting = false }: GenerationCreateModalProps) => {
  useScrollLock();

  const [number, setNumber] = useState('');
  const [year, setYear] = useState('');
  const [partNames, setPartNames] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const isInvalid = isUnfilled(number) || isUnfilled(year) || partNames.length === 0;

  const handleSubmit = () => {
    if (isInvalid) {
      setShowErrors(true);
      return;
    }
    onSubmit({ number: Number(number), year: Number(year), partNames });
  };

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="기수/파트 생성">
      <Dimmer onClick={onClose} />
      <Modal>
        <InformationScroll>
          <Information>
            <ModalTitle>기수/파트 생성</ModalTitle>
            <FieldRow>
              <FieldWrapper>
                <TextField
                  heading="신규기수"
                  required
                  value={number}
                  placeholder="숫자 입력"
                  onChange={(event) => NUMERIC_ONLY_REGEX.test(event.target.value) && setNumber(event.target.value)}
                  status={showErrors && isUnfilled(number) ? 'negative' : 'normal'}
                  description={showErrors && isUnfilled(number) ? '기수를 입력해 주세요.' : undefined}
                />
              </FieldWrapper>
              <FieldWrapper>
                <TextField
                  heading="활동 년도"
                  required
                  value={year}
                  placeholder="숫자 입력"
                  onChange={(event) => NUMERIC_ONLY_REGEX.test(event.target.value) && setYear(event.target.value)}
                  status={showErrors && isUnfilled(year) ? 'negative' : 'normal'}
                  description={showErrors && isUnfilled(year) ? '활동 년도를 입력해 주세요.' : undefined}
                />
              </FieldWrapper>
            </FieldRow>
            <FieldColumn>
              <Heading>
                <HeadingLabel>파트명</HeadingLabel>
                <Required>*</Required>
              </Heading>
              <TechStackInput value={partNames} onChange={setPartNames} placeholder="파트를 모두 입력해 주세요." />
              {showErrors && partNames.length === 0 && <Description>파트명을 입력해 주세요.</Description>}
            </FieldColumn>
          </Information>
        </InformationScroll>
        <Actions>
          <WarningText>
            생성한 파트는 <EmphasisSpan>생성 후 수정할 수 없습니다.</EmphasisSpan>
          </WarningText>
          <ModalActions>
            <Button variant="outlined" color="assistive" size="large" onClick={onClose} disabled={isSubmitting}>
              취소
            </Button>
            <Button size="large" onClick={handleSubmit} loading={isSubmitting} disabled={isInvalid}>
              생성하기
            </Button>
          </ModalActions>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default GenerationCreateModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 1000;
`;

const Dimmer = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${Material.dimmer};
  opacity: 0.43;
`;

const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 320px;
  max-width: 400px;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${BackgroundWhite.primary};
`;

const InformationScroll = styled(ScrollArea)`
  flex: 1 1 auto;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 28px;
`;

const ModalTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const FieldRow = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

const FieldWrapper = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

const FieldColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

const HeadingLabel = styled.span`
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const Required = styled.span`
  color: ${Status.negative};
  ${typographyCss(Typography.label1Normal.medium)}
`;

const Description = styled.p`
  margin: 0;
  width: 100%;
  color: ${Status.negative};
  ${typographyCss(Typography.caption1.regular)}
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0 28px 28px;
`;

const WarningText = styled.p`
  margin: 0;
  text-align: center;
  color: ${State.error};
  ${typographyCss(Typography.label2.regular)}
`;

const EmphasisSpan = styled.span`
  font-weight: 600;
  text-decoration: underline;
`;

const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  padding: 12px 0;
`;
