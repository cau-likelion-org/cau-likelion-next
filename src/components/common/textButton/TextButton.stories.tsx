import type { Meta, StoryObj } from '@storybook/nextjs';
import TextButton from './TextButton';

const meta: Meta<typeof TextButton> = {
  title: 'common/TextButton',
  component: TextButton,
  argTypes: {
    color: {
      control: 'radio',
      options: ['primary', 'assistive'],
    },
    size: {
      control: 'radio',
      options: ['large', 'small'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextButton>;

export const Default: Story = {
  args: {
    color: 'primary',
    size: 'large',
    children: '텍스트',
  },
};

export const Assistive: Story = {
  args: {
    color: 'assistive',
    size: 'large',
    children: '텍스트',
  },
};

export const Small: Story = {
  args: {
    color: 'primary',
    size: 'small',
    children: '텍스트',
  },
};

export const Disabled: Story = {
  args: {
    color: 'primary',
    size: 'large',
    disabled: true,
    children: '텍스트',
  },
};

export const Loading: Story = {
  args: {
    color: 'primary',
    size: 'large',
    loading: true,
    children: '텍스트',
  },
};
