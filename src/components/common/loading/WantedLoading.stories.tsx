import type { Meta, StoryObj } from '@storybook/react';
import WantedLoading from './WantedLoading';

const meta: Meta<typeof WantedLoading> = {
  title: 'common/WantedLoading',
  component: WantedLoading,
};

export default meta;
type Story = StoryObj<typeof WantedLoading>;

export const Default: Story = {
  args: {},
};

export const Large: Story = {
  args: {
    size: 64,
  },
};
