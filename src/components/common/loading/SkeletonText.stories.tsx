import type { Meta, StoryObj } from '@storybook/react';
import SkeletonText from './SkeletonText';

const meta: Meta<typeof SkeletonText> = {
  title: 'common/SkeletonText',
  component: SkeletonText,
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SkeletonText>;

export const Default: Story = {
  args: {},
};

export const Length75: Story = {
  args: {
    length: '75%',
  },
};

export const Length50: Story = {
  args: {
    length: '50%',
  },
};

export const Length25: Story = {
  args: {
    length: '25%',
  },
};

export const Center: Story = {
  args: {
    length: '50%',
    align: 'center',
  },
};

export const Trailing: Story = {
  args: {
    length: '50%',
    align: 'trailing',
  },
};

export const White: Story = {
  args: {
    color: 'white',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240, padding: 16, background: '#171719' }}>
        <Story />
      </div>
    ),
  ],
};
