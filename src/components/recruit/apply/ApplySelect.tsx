import styled from 'styled-components';

import { FieldStatus } from '@common/fieldStatus/FieldStatus';
import ListboxSelect from '@common/select/ListboxSelect';

import { applyFieldHeadingCss } from './applyFieldStyle';

export interface ApplySelectProps {
  heading: string;
  options: string[];
  value: string;
  status?: FieldStatus;
  description?: string;
  onChange: (value: string) => void;
}

const ApplySelect = ({ heading, options, value, status, description, onChange }: ApplySelectProps) => (
  <StyledSelect
    fullWidth
    heading={heading}
    required
    ariaLabel={heading}
    placeholder="선택해주세요"
    options={options}
    value={value}
    status={status}
    description={description}
    onChange={onChange}
  />
);

export default ApplySelect;

const StyledSelect = styled(ListboxSelect)`
  ${applyFieldHeadingCss}
`;
