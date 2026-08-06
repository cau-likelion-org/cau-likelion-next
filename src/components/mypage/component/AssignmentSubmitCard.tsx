import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import Textarea from '@common/textarea/Textarea';
import { IcCircleClose, IcDocument, IcLink, IcPlus } from '@assets/svg';
import { BackgroundWhite, Black, Fill, Label, Line, Status } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type SubmissionFormat = 'file' | 'link';

const FORMAT_LABEL: Record<SubmissionFormat, string> = {
  file: '파일 첨부',
  link: '링크 첨부',
};

const DESCRIPTION_MAX_LENGTH = 300;

export interface AssignmentSubmitItem {
  id: string;
  name: string;
  description: string;
  format: SubmissionFormat;
}

interface AssignmentSubmitCardProps {
  item: AssignmentSubmitItem;
  onValidityChange?: (itemId: string, isValid: boolean) => void;
}

const AssignmentSubmitCard = ({ item, onValidityChange }: AssignmentSubmitCardProps) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = item.format === 'file' ? fileNames.length > 0 : link.trim() !== '';

  useEffect(() => {
    onValidityChange?.(item.id, isValid);
  }, [item.id, isValid, onValidityChange]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFileNames((prev) => [...prev, file.name]);
    event.target.value = '';
  };

  const handleFileRemove = (index: number) => {
    setFileNames((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <Header>
        <ItemName>{item.name}</ItemName>
        <ItemDescription>{item.description}</ItemDescription>
        <FormatFieldWrapper>
          <FormatHeading>제출 형식</FormatHeading>
          <FormatValue>{FORMAT_LABEL[item.format]}</FormatValue>
        </FormatFieldWrapper>
      </Header>

      <AttachmentBox>
        {item.format === 'file' ? (
          <Field>
            <FieldHeading>
              파일 첨부 <Required>*</Required>
            </FieldHeading>
            {fileNames.map((fileName, index) => (
              <AttachmentRow key={`${fileName}-${index}`}>
                <AttachmentField>
                  <AttachmentIcon>
                    <IcDocument width={22} height={22} />
                  </AttachmentIcon>
                  <AttachmentText>{fileName}</AttachmentText>
                </AttachmentField>
                <RemoveButton type="button" aria-label="파일 삭제" onClick={() => handleFileRemove(index)}>
                  <IcCircleClose width={24} height={24} />
                </RemoveButton>
              </AttachmentRow>
            ))}
            {fileNames.length === 0 ? (
              <FilePickerButton type="button" onClick={() => fileInputRef.current?.click()}>
                파일을 선택해 주세요. (100MB)
              </FilePickerButton>
            ) : (
              <AddButton type="button" onClick={() => fileInputRef.current?.click()}>
                <IcPlus width={24} height={24} />
              </AddButton>
            )}
            <HiddenFileInput ref={fileInputRef} type="file" onChange={handleFileChange} />
          </Field>
        ) : (
          <Field>
            <FieldHeading>
              링크 첨부 <Required>*</Required>
            </FieldHeading>
            <AttachmentField>
              <AttachmentIcon>
                <IcLink width={22} height={22} />
              </AttachmentIcon>
              <LinkInput
                type="url"
                placeholder="URL을 입력하세요."
                value={link}
                onChange={(event) => setLink(event.target.value)}
                $hasValue={link.trim() !== ''}
              />
            </AttachmentField>
          </Field>
        )}

        <Field>
          <FieldHeading>과제 설명</FieldHeading>
          <Textarea
            placeholder="제출물에 대한 설명을 입력하세요."
            maxLength={DESCRIPTION_MAX_LENGTH}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            bottomTrailingContent={
              <CharCount>
                {description.length}/{DESCRIPTION_MAX_LENGTH}
              </CharCount>
            }
          />
        </Field>
      </AttachmentBox>
    </Card>
  );
};

export default AssignmentSubmitCard;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
  padding: 32px;
  border: 1px solid ${Line.subtle};
  border-radius: 22px;
  background-color: ${BackgroundWhite.secondary};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
`;

const ItemName = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.title2.bold)}
`;

const ItemDescription = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.heading2.medium)}
`;

const FormatFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 160px;
`;

const FormatHeading = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const FormatValue = styled.p`
  margin: 0;
  padding: 12px;
  border: 1px solid ${Line.subtle};
  border-radius: 12px;
  background-color: ${Fill.subtle};
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const AttachmentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  width: 100%;
  padding: 22px;
  border-radius: 14px;
  background-color: ${BackgroundWhite.tertiary};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
`;

const FieldHeading = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.title3.bold)}
`;

const Required = styled.span`
  color: ${Status.negative};
`;

const AttachmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const AttachmentField = styled.div`
  display: flex;
  flex: 1 0 0;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${Line.normal};
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 1px 2px -1px rgba(23, 23, 23, 0.1);
`;

const AttachmentIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${Label.alternative};
`;

const AttachmentText = styled.p`
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: underline;
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const LinkInput = styled.input<{ $hasValue: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  border: none;
  outline: none;
  background: none;
  text-decoration: ${(props) => (props.$hasValue ? 'underline' : 'none')};
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.regular)}

  &::placeholder {
    color: ${Label.alternative};
  }
`;

const RemoveButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
`;

const FilePickerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  background-color: ${Fill.normal};
  color: ${Label.neutral};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.medium)}
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background-color: ${Fill.normal};
  color: ${Label.neutral};
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CharCount = styled.span`
  color: ${Label.alternative};
  ${typographyCss(Typography.label2.regular)}
`;
