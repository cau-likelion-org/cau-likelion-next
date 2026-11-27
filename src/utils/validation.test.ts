import { describe, expect, it } from 'vitest';

import {
  formatPhoneNumber,
  getPasswordError,
  isEmailFormatInvalid,
  isNameFormatInvalid,
  isPhoneFormatInvalid,
  isUnfilled,
} from './validation';

describe('isUnfilled', () => {
  it('공백만 있으면 비어 있다고 본다', () => {
    expect(isUnfilled('')).toBe(true);
    expect(isUnfilled('  \n')).toBe(true);
    expect(isUnfilled(' a ')).toBe(false);
  });
});

describe('isEmailFormatInvalid', () => {
  it('올바른 이메일은 통과시킨다', () => {
    expect(isEmailFormatInvalid('puang@likelion.org')).toBe(false);
  });

  it('한글이 섞이거나 형식이 틀리면 잘못된 것으로 본다', () => {
    expect(isEmailFormatInvalid('푸앙@likelion.org')).toBe(true);
    expect(isEmailFormatInvalid('puang@likelion')).toBe(true);
    expect(isEmailFormatInvalid('puang.likelion.org')).toBe(true);
  });

  it('비어 있는 값은 형식 오류로 보지 않는다', () => {
    expect(isEmailFormatInvalid('')).toBe(false);
    expect(isEmailFormatInvalid('   ')).toBe(false);
  });
});

describe('isNameFormatInvalid', () => {
  it('한글·영문 2~20자는 통과시킨다', () => {
    expect(isNameFormatInvalid('홍길동')).toBe(false);
    expect(isNameFormatInvalid('Gil Dong')).toBe(false);
  });

  it('한 글자이거나 숫자·특수문자가 섞이면 잘못된 것으로 본다', () => {
    expect(isNameFormatInvalid('홍')).toBe(true);
    expect(isNameFormatInvalid('홍길동1')).toBe(true);
    expect(isNameFormatInvalid('홍길동!')).toBe(true);
  });

  it('비어 있는 값은 형식 오류로 보지 않는다', () => {
    expect(isNameFormatInvalid('')).toBe(false);
  });
});

describe('formatPhoneNumber', () => {
  it('입력한 자릿수에 맞춰 하이픈을 넣는다', () => {
    expect(formatPhoneNumber('010')).toBe('010');
    expect(formatPhoneNumber('0101234')).toBe('010-1234');
    expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
  });

  it('숫자가 아닌 문자는 지우고 11자리까지만 남긴다', () => {
    expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678');
    expect(formatPhoneNumber('010a1234 56789')).toBe('010-1234-5678');
  });
});

describe('isPhoneFormatInvalid', () => {
  it('010-0000-0000 형식만 통과시킨다', () => {
    expect(isPhoneFormatInvalid('010-1234-5678')).toBe(false);
    expect(isPhoneFormatInvalid('010-1234-567')).toBe(true);
    expect(isPhoneFormatInvalid('011-1234-5678')).toBe(true);
  });

  it('비어 있는 값은 형식 오류로 보지 않는다', () => {
    expect(isPhoneFormatInvalid('')).toBe(false);
  });
});

describe('getPasswordError', () => {
  it('8자 이상 영문·숫자·특수문자 조합은 통과시킨다', () => {
    expect(getPasswordError('abcd1234')).toBeUndefined();
    expect(getPasswordError('Abc!@#12')).toBeUndefined();
  });

  it('8자 미만이면 길이 오류를 알려준다', () => {
    expect(getPasswordError('abc123')).toBe('8자 이상 입력해 주세요.');
  });

  it('공백이나 한글이 섞이면 허용 문자 오류를 알려준다', () => {
    expect(getPasswordError('abcd 1234')).toBe('영문 대소문자, 숫자, 특수문자만 사용할 수 있습니다.');
    expect(getPasswordError('비밀번호1234')).toBe('영문 대소문자, 숫자, 특수문자만 사용할 수 있습니다.');
  });

  it('비어 있는 값은 오류로 보지 않는다', () => {
    expect(getPasswordError('')).toBeUndefined();
  });
});
