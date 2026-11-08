import { ChangeEvent, ReactNode, useRef } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import { FieldDescription } from '@common/fieldStatus/FieldStatus';
import TextField from '@common/textField/TextField';
import { IcCircleClose, IcDocument, IcUpload } from '@assets/svg';
import { formatFileSize } from '@utils/index';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import ApplyFieldHeading from './ApplyFieldHeading';

export interface ApplyFileFieldProps {
  heading: string;
  required?: boolean;
  headingTrailing?: ReactNode;
  placeholder: string;
  accept: string;
  file?: File;
  showFileSize?: boolean;
  loading?: boolean;
  description?: string;
  error?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

const ApplyFileField = ({
  heading,
  required = false,
  headingTrailing,
  placeholder,
  accept,
  file,
  showFileSize = false,
  loading = false,
  description,
  error,
  onSelect,
  onRemove,
}: ApplyFileFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const message = error ?? description;

  const changeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    // 같은 파일을 다시 골라도 onChange가 불리도록 비운다
    event.target.value = '';
    if (selected) onSelect(selected);
  };

  return (
    <Root>
      <ApplyFieldHeading title={heading} required={required} trailing={headingTrailing} />
      {/* [다음]을 눌렀을 때 첫 오류 위치로 스크롤하기 위한 기준점 (useScrollToFirstError가 aria-invalid로 찾는다) */}
      <ErrorAnchor aria-invalid={!!error} tabIndex={-1}>
        {file ? (
          <AttachedRow>
            <AttachedFileName
              aria-label={heading}
              value={file.name}
              readOnly
              leadingIcon={<IcDocument width={22} height={22} />}
              trailingContent={showFileSize && <FileSize>{formatFileSize(file.size)}</FileSize>}
              status={error ? 'negative' : 'normal'}
              description={message}
            />
            <AttachedRemove>
              <RemoveButton type="button" aria-label={`${heading} 삭제`} onClick={onRemove}>
                <IcCircleClose width={24} height={24} />
              </RemoveButton>
            </AttachedRemove>
          </AttachedRow>
        ) : (
          <FileButton
            color="assistive"
            loading={loading}
            leadingIcon={<IcUpload width={20} height={20} />}
            $invalid={!!error}
            onClick={() => inputRef.current?.click()}
          >
            {placeholder}
          </FileButton>
        )}
      </ErrorAnchor>
      <HiddenFileInput ref={inputRef} type="file" accept={accept} aria-label={heading} onChange={changeFile} />
      {!file && message && <FieldDescription $status={error ? 'negative' : 'normal'}>{message}</FieldDescription>}
    </Root>
  );
};

export default ApplyFileField;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const ErrorAnchor = styled.div`
  width: 100%;
  outline: none;
`;

// Figma 안쪽 점선 테두리: 버튼 크기가 바뀌지 않도록 outline을 안쪽으로 그린다
const FileButton = styled(Button)<{ $invalid: boolean }>`
  width: 100%;
  outline: 1.5px dashed ${(props) => (props.$invalid ? 'rgba(255, 0, 0, 0.28)' : Label.assistive)};
  outline-offset: -1.5px;
`;

const FileSize = styled.span`
  flex-shrink: 0;
  padding: 0 4px;
  color: ${Label.alternative};
  ${typographyCss(Typography.body2Normal.regular)}
`;

const RemoveButton = styled.button`
  display: flex;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
`;

const AttachedRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
`;

const AttachedFileName = styled(TextField)`
  flex: 1 0 0;
  min-width: 0;

  input {
    text-decoration: underline;
  }
`;

const AttachedRemove = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
