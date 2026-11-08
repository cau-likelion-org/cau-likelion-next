import { ChangeEvent, ReactNode, useRef } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import { FieldDescription, getFieldBoxShadow } from '@common/fieldStatus/FieldStatus';
import TextField from '@common/textField/TextField';
import { IcCircleClose } from '@assets/svg';
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
  loading = false,
  description,
  error,
  onSelect,
  onRemove,
}: ApplyFileFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
          <TextField
            aria-label={heading}
            value={file.name}
            readOnly
            trailingContent={
              <>
                <FileSize>{formatFileSize(file.size)}</FileSize>
                <RemoveButton type="button" aria-label={`${heading} 삭제`} onClick={onRemove}>
                  <IcCircleClose width={22} height={22} />
                </RemoveButton>
              </>
            }
          />
        ) : (
          <FileButton color="assistive" loading={loading} $invalid={!!error} onClick={() => inputRef.current?.click()}>
            {placeholder}
          </FileButton>
        )}
      </ErrorAnchor>
      <HiddenFileInput ref={inputRef} type="file" accept={accept} aria-label={heading} onChange={changeFile} />
      {(error ?? description) && (
        <FieldDescription $status={error ? 'negative' : 'normal'}>{error ?? description}</FieldDescription>
      )}
    </Root>
  );
};

export default ApplyFileField;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ErrorAnchor = styled.div`
  width: 100%;
  outline: none;
`;

const FileButton = styled(Button)<{ $invalid: boolean }>`
  width: 100%;
  ${(props) => props.$invalid && `box-shadow: ${getFieldBoxShadow('negative', false)};`}
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
  color: ${Label.alternative};
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
