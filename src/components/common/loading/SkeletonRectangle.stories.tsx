import type { Meta, StoryObj } from '@storybook/react';
import SkeletonRectangle from './SkeletonRectangle';

const meta: Meta<typeof SkeletonRectangle> = {
  title: 'common/SkeletonRectangle',
  component: SkeletonRectangle,
};

export default meta;
type Story = StoryObj<typeof SkeletonRectangle>;

export const Default: Story = {
  args: {},
};

export const CustomSize: Story = {
  args: {
    width: 120,
    height: 80,
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
