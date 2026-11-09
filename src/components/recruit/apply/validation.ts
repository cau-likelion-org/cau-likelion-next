import { FieldStatus } from '@common/fieldStatus/FieldStatus';
import { REQUIRED_FIELD_MESSAGE } from '@utils/constant';

export const REQUIRED_MESSAGE = REQUIRED_FIELD_MESSAGE;
export const FORMAT_MESSAGE = '형식이 맞지 않습니다.';

export const toFieldStatus = (error?: string): FieldStatus => (error ? 'negative' : 'normal');

export const EMAIL_FORMAT_MESSAGE = '이메일 형식이 올바르지 않습니다.';
export const PASSWORD_CAPTION = '영문 대소문자, 숫자, 특수문자를 사용할 수 있습니다.';
export const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 일치하지 않습니다.';
