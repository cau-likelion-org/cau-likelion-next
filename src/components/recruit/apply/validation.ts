import { FieldStatus } from '@common/fieldStatus/FieldStatus';

export const REQUIRED_MESSAGE = '필수 입력 문항입니다.';
export const FORMAT_MESSAGE = '형식이 맞지 않습니다.';

export const toFieldStatus = (error?: string): FieldStatus => (error ? 'negative' : 'normal');
