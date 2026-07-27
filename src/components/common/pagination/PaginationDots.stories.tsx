import type { Meta, StoryObj } from '@storybook/nextjs';
import PaginationDots from './PaginationDots';

const meta: Meta<typeof PaginationDots> = {
  title: 'common/PaginationDots',
  component: PaginationDots,
};

export default meta;
type Story = StoryObj<typeof PaginationDots>;

export const FewPages: Story = {
  args: {
    total: 4,
    current: 1,
  },
};

export const ManyPagesAtStart: Story = {
  args: {
    total: 10,
    current: 0,
  },
};

export const ManyPagesInMiddle: Story = {
  args: {
    total: 10,
    current: 5,
  },
};

export const ManyPagesAtEnd: Story = {
  args: {
    total: 10,
    current: 9,
  },
};

export const Small: Story = {
  args: {
    total: 10,
    current: 5,
    size: 'small',
  },
};

export const White: Story = {
  args: {
    total: 10,
    current: 5,
    variant: 'white',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16, background: '#171719' }}>
        <Story />
      </div>
    ),
  ],
};
