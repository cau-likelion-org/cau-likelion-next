import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Snackbar from './Snackbar';

const meta: Meta<typeof Snackbar> = {
  title: 'common/Snackbar',
  component: Snackbar,
  decorators: [
    (Story: ComponentType) => (
      <div style={{ background: '#F0F3F6', padding: '48px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Snackbar>;

export const Default: Story = {
  args: {
    text: '메시지에 마침표를 찍어요.',
  },
};

export const WithDescription: Story = {
  args: {
    text: '메시지에 마침표를 찍어요.',
    description: '설명은 필요할 때만 써요.',
  },
};

export const WithAction: Story = {
  args: {
    text: '메시지에 마침표를 찍어요.',
    actionLabel: '실행 취소',
    onAction: () => alert('실행 취소'),
  },
};

export const WithCloseButton: Story = {
  args: {
    text: '메시지에 마침표를 찍어요.',
    actionLabel: '실행 취소',
    onAction: () => alert('실행 취소'),
    onClose: () => alert('닫기'),
  },
};
