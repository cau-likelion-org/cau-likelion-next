import type { Meta, StoryObj } from '@storybook/react';
import SkeletonCircle from './SkeletonCircle';

const meta: Meta<typeof SkeletonCircle> = {
  title: 'common/SkeletonCircle',
  component: SkeletonCircle,
};

export default meta;
type Story = StoryObj<typeof SkeletonCircle>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 32,
  },
};

export const White: Story = {
  args: {
    color: 'white',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: '#171719' }}>
        <Story />
      </div>
    ),
  ],
};
