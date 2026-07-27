import type { Meta, StoryObj } from '@storybook/react';
import Tooltip, { TooltipProps } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'common/Tooltip',
  component: Tooltip,
  argTypes: {
    size: {
      control: 'radio',
      options: ['medium', 'small'],
    },
    position: {
      control: 'radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
    align: {
      control: 'radio',
      options: ['start', 'center', 'end'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    size: 'medium',
    position: 'bottom',
    text: '메시지에 마침표를 찍어요.',
  },
};

export const WithShortcut: Story = {
  args: {
    size: 'small',
    position: 'top',
    text: '역할',
    shortcut: '⌘C',
  },
};

export const AllPositions: Story = {
  render: (args: TooltipProps) => (
    <div style={{ display: 'flex', gap: '48px', padding: '48px' }}>
      <Tooltip {...args} position="top" />
      <Tooltip {...args} position="bottom" />
      <Tooltip {...args} position="left" />
      <Tooltip {...args} position="right" />
    </div>
  ),
  args: {
    size: 'medium',
    text: '메시지에 마침표를 찍어요.',
  },
};

export const AllAligns: Story = {
  render: (args: TooltipProps) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '48px' }}>
      <div style={{ display: 'flex', gap: '48px' }}>
        <Tooltip {...args} position="bottom" align="start" />
        <Tooltip {...args} position="bottom" align="center" />
        <Tooltip {...args} position="bottom" align="end" />
      </div>
      <div style={{ display: 'flex', gap: '48px' }}>
        <Tooltip {...args} position="right" align="start" />
        <Tooltip {...args} position="right" align="center" />
        <Tooltip {...args} position="right" align="end" />
      </div>
    </div>
  ),
  args: {
    size: 'medium',
    text: '메시지에 마침표를 찍어요.',
  },
};
