import { FieldStatus } from '@common/fieldStatus/FieldStatus';
import { REQUIRED_FIELD_MESSAGE } from '@utils/constant';

export const REQUIRED_MESSAGE = REQUIRED_FIELD_MESSAGE;
export const FORMAT_MESSAGE = '형식이 맞지 않습니다.';

export const toFieldStatus = (error?: string): FieldStatus => (error ? 'negative' : 'normal');
