import type { Meta, StoryObj } from '@storybook/nextjs';
import Divider from './Divider';
import type { DividerProps } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'common/Divider',
  component: Divider,
  argTypes: {
    variant: {
      control: 'radio',
      options: ['normal', 'thick'],
    },
    vertical: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    variant: 'normal',
    vertical: false,
  },
  render: (args: DividerProps) => (
    <div style={{ width: '375px' }}>
      <Divider {...args} />
    </div>
  ),
};

export const Thick: Story = {
  args: {
    variant: 'thick',
    vertical: false,
  },
  render: (args: DividerProps) => (
    <div style={{ width: '375px' }}>
      <Divider {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    variant: 'normal',
    vertical: true,
  },
  render: (args: DividerProps) => (
    <div style={{ height: '32px', display: 'flex' }}>
      <Divider {...args} />
    </div>
  ),
};
