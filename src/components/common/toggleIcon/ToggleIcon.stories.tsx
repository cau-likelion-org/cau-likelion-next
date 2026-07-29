import type { Meta, StoryObj } from '@storybook/nextjs';
import IcBlank from '@assets/svg/ic-blank.svg';
import ToggleIcon from './ToggleIcon';

const meta: Meta<typeof ToggleIcon> = {
  title: 'common/ToggleIcon',
  component: ToggleIcon,
  args: {
    icon: <IcBlank />,
    'aria-label': '토글',
  },
};

export default meta;
type Story = StoryObj<typeof ToggleIcon>;

export const Default: Story = {
  args: {
    active: false,
  },
};

export const Active: Story = {
  args: {
    active: true,
  },
};
