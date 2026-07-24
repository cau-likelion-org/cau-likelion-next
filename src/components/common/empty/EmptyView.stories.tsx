import type { Meta, StoryObj } from '@storybook/react';
import EmptyView from './EmptyView';

const meta: Meta<typeof EmptyView> = {
  title: 'common/EmptyView',
  component: EmptyView,
};

export default meta;
type Story = StoryObj<typeof EmptyView>;

export const Default: Story = {};