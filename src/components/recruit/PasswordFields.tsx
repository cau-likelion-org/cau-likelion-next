import { useState } from 'react';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import { applyFieldHeadingCss } from '@recruit/apply/applyFieldStyle';
import { PASSWORD_CAPTION, PASSWORD_MISMATCH_MESSAGE } from '@recruit/apply/validation';
import { getPasswordError, isUnfilled } from '@utils/index';

export const isPasswordFieldsValid = (password: string, passwordConfirm: string) =>
  !isUnfilled(password) && !getPasswordError(password) && passwordConfirm === password;

export interface PasswordFieldsProps {
  heading: string;
  required?: boolean;
  password: string;
  passwordConfirm: string;
  onPasswordChange: (password: string) => void;
  onPasswordConfirmChange: (passwordConfirm: string) => void;
}

const PasswordFields = ({
  heading,
  required = false,
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
}: PasswordFieldsProps) => {
  const [touched, setTouched] = useState({ password: false, passwordConfirm: false });

  const passwordError = touched.password ? getPasswordError(password) : undefined;
  const passwordConfirmError =
    touched.passwordConfirm && !isUnfilled(passwordConfirm) && passwordConfirm !== password
      ? PASSWORD_MISMATCH_MESSAGE
      : undefined;

  return (
    <>
      <PasswordTextField
        heading={heading}
        required={required}
        type="password"
        placeholder="8자 이상 입력해 주세요"
        autoComplete="new-password"
        value={password}
        status={passwordError ? 'negative' : 'normal'}
        description={passwordError ?? PASSWORD_CAPTION}
        onChange={(event) => onPasswordChange(event.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
      />
      <PasswordTextField
        heading="비밀번호 확인"
        required={required}
        type="password"
        placeholder="비밀번호를 한 번 더 입력해 주세요"
        autoComplete="new-password"
        value={passwordConfirm}
        status={passwordConfirmError ? 'negative' : 'normal'}
        description={passwordConfirmError}
        onChange={(event) => onPasswordConfirmChange(event.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, passwordConfirm: true }))}
      />
    </>
  );
};

export default PasswordFields;

const PasswordTextField = styled(TextField)`
  ${applyFieldHeadingCss}
`;
