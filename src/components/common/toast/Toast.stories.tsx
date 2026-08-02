import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
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

const PREVIEW_ARGS = { show: true, delay: 0, duration: 999999 };

export const Default: Story = {
  args: {
    variant: 'normal',
    text: '메시지에 마침표를 찍어요.',
    ...PREVIEW_ARGS,
  },
};

export const Positive: Story = {
  args: {
    variant: 'positive',
    text: '메시지에 마침표를 찍어요.',
    ...PREVIEW_ARGS,
  },
};

export const Cautionary: Story = {
  args: {
    variant: 'cautionary',
    text: '메시지에 마침표를 찍어요.',
    ...PREVIEW_ARGS,
  },
};

export const Negative: Story = {
  args: {
    variant: 'negative',
    text: '메시지에 마침표를 찍어요.',
    ...PREVIEW_ARGS,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Toast variant="normal" text="메시지에 마침표를 찍어요." {...PREVIEW_ARGS} />
      <Toast variant="positive" text="메시지에 마침표를 찍어요." {...PREVIEW_ARGS} />
      <Toast variant="cautionary" text="메시지에 마침표를 찍어요." {...PREVIEW_ARGS} />
      <Toast variant="negative" text="메시지에 마침표를 찍어요." {...PREVIEW_ARGS} />
    </div>
  ),
};
