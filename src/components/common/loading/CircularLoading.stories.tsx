import type { Meta, StoryObj } from '@storybook/react';
import CircularLoading from './CircularLoading';

const meta: Meta<typeof CircularLoading> = {
  title: 'common/CircularLoading',
  component: CircularLoading,
};

export default meta;
type Story = StoryObj<typeof CircularLoading>;

export const Default: Story = {
  args: {},
};

export const Large: Story = {
  args: {
    size: 48,
  },
};

export const CustomColor: Story = {
  args: {
    color: '#6541F2',
  },
};
