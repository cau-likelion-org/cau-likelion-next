import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Toast from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'common/Toast',
  component: Toast,
  argTypes: {
    variant: {
      control: 'radio',
      options: ['normal', 'positive', 'cautionary', 'negative'],
    },
  },
  decorators: [
    (Story: ComponentType) => (
      <div style={{ background: '#F0F3F6', padding: '48px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    variant: 'normal',
    text: '메시지에 마침표를 찍어요.',
  },
};

export const Positive: Story = {
  args: {
    variant: 'positive',
    text: '메시지에 마침표를 찍어요.',
  },
};

export const Cautionary: Story = {
  args: {
    variant: 'cautionary',
    text: '메시지에 마침표를 찍어요.',
  },
};

export const Negative: Story = {
  args: {
    variant: 'negative',
    text: '메시지에 마침표를 찍어요.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Toast variant="normal" text="메시지에 마침표를 찍어요." />
      <Toast variant="positive" text="메시지에 마침표를 찍어요." />
      <Toast variant="cautionary" text="메시지에 마침표를 찍어요." />
      <Toast variant="negative" text="메시지에 마침표를 찍어요." />
    </div>
  ),
};
