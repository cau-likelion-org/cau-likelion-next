export const isUnfilled = (value: string) => value.trim().length === 0;

// 한글 등 이메일에 쓰일 수 없는 문자가 섞여 들어가는 것을 막기 위해 허용 문자를 제한한다
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const isEmailFormatInvalid = (email: string) => !isUnfilled(email) && !EMAIL_REGEX.test(email);

const NAME_REGEX = /^[가-힣A-Za-z ]{2,20}$/;
export const isNameFormatInvalid = (name: string) => !isUnfilled(name) && !NAME_REGEX.test(name.trim());

// 숫자만 남겨 010-0000-0000 형태로 하이픈을 채운다
export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const PHONE_REGEX = /^010-\d{4}-\d{4}$/;
export const isPhoneFormatInvalid = (phone: string) => !isUnfilled(phone) && !PHONE_REGEX.test(phone);

const PASSWORD_MIN_LENGTH = 8;
// 공백을 제외한 영문 대소문자, 숫자, 특수문자(ASCII)만 허용한다
const PASSWORD_CHAR_REGEX = /^[\x21-\x7E]*$/;
export const getPasswordError = (password: string) => {
  if (isUnfilled(password)) return undefined;
  if (!PASSWORD_CHAR_REGEX.test(password)) return '영문 대소문자, 숫자, 특수문자만 사용할 수 있습니다.';
  if (password.length < PASSWORD_MIN_LENGTH) return '8자 이상 입력해 주세요.';
  return undefined;
};
