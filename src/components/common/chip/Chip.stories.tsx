import type { Meta, StoryObj } from '@storybook/nextjs';
import Chip from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'common/Chip',
  component: Chip,
  argTypes: {
    variant: {
      control: 'radio',
      options: ['filled', 'outlined'],
    },
    size: {
      control: 'radio',
      options: ['xsmall', 'small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    variant: 'filled',
    size: 'medium',
    children: '텍스트',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    size: 'medium',
    children: '텍스트',
  },
};

export const Active: Story = {
  args: {
    variant: 'filled',
    size: 'medium',
    active: true,
    children: '텍스트',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Chip size="xsmall">XSmall</Chip>
      <Chip size="small">Small</Chip>
      <Chip size="medium">Medium</Chip>
      <Chip size="large">Large</Chip>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    variant: 'filled',
    size: 'medium',
    disabled: true,
    children: '텍스트',
  },
};
