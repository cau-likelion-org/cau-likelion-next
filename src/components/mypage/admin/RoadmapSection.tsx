import { useRef } from 'react';
import styled from 'styled-components';

import { IcCircleCloseOutline, IcImage } from '@assets/svg';
import { Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const RoadmapSection = ({
  imageUrl,
  fileName,
  onSelectFile,
  onClear,
  disabled = false,
  isUploading = false,
}: {
  imageUrl: string;
  fileName: string;
  onSelectFile: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
  isUploading?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isInteractive = !disabled && !isUploading;

  return (
    <Section>
      <Title>활동 로드맵 관리</Title>
      <FieldWrapper>
        <Heading>이미지 첨부</Heading>
        <InputWrapper onClick={() => isInteractive && inputRef.current?.click()} $clickable={isInteractive}>
          <IconSlot>
            <IcImage width={22} height={22} />
          </IconSlot>
          <FileName $empty={!imageUrl}>
            {isUploading ? '업로드 중...' : imageUrl ? fileName : '이미지 파일을 선택해 주세요.'}
          </FileName>
          {imageUrl && !disabled && !isUploading && (
            <ClearButton
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClear();
              }}
              aria-label="이미지 삭제"
            >
              <IcCircleCloseOutline width={24} height={24} />
            </ClearButton>
          )}
        </InputWrapper>
        <HiddenInput
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onSelectFile(file);
            event.target.value = '';
          }}
        />
      </FieldWrapper>
    </Section>
  );
};

export default RoadmapSection;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Heading = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const InputWrapper = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 24px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
`;

const IconSlot = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${Label.alternative};
`;

const FileName = styled.p<{ $empty: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => (props.$empty ? Label.assistive : Label.normal)};
  text-decoration: ${(props) => (props.$empty ? 'none' : 'underline')};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;
