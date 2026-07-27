import type { Meta, StoryObj } from '@storybook/nextjs';
import PageIndicator from './PageIndicator';

const meta: Meta<typeof PageIndicator> = {
  title: 'common/PageIndicator',
  component: PageIndicator,
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#3B3F4A' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PageIndicator>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPage: 10,
  },
};

export const Small: Story = {
  args: {
    currentPage: 1,
    totalPage: 10,
    size: 'small',
  },
};

export const Alternative: Story = {
  args: {
    currentPage: 1,
    totalPage: 10,
    alternative: true,
  },
};
