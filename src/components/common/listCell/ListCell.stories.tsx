import type { Meta, StoryObj } from '@storybook/nextjs';
import ListCell from './ListCell';

const meta: Meta<typeof ListCell> = {
  title: 'common/ListCell',
  component: ListCell,
  decorators: [
    (Story) => (
      <div style={{ width: 335 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ListCell>;

export const Default: Story = {
  args: {
    label: '텍스트',
  },
};

export const WithDescription: Story = {
  args: {
    label: '텍스트',
    description: '설명',
  },
};

export const WithTrailingValue: Story = {
  args: {
    label: '텍스트',
    trailingContent: '값',
  },
};

export const WithChevron: Story = {
  args: {
    label: '텍스트',
    trailingContent: '값',
    chevron: true,
    onClick: () => alert('clicked'),
  },
};

export const Selected: Story = {
  args: {
    label: '텍스트',
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    label: '텍스트',
    trailingContent: '값',
    chevron: true,
    disabled: true,
  },
};

export const List: Story = {
  render: () => (
    <div>
      <ListCell label="첫 번째 항목" description="설명 텍스트" divider onClick={() => {}} chevron />
      <ListCell label="두 번째 항목" selected divider onClick={() => {}} />
      <ListCell label="세 번째 항목 (비활성)" disabled trailingContent="값" />
    </div>
  ),
};

export const VerticalPaddingSizes: Story = {
  render: () => (
    <div>
      <ListCell label="Large" verticalPadding="large" divider />
      <ListCell label="Medium" verticalPadding="medium" divider />
      <ListCell label="Small" verticalPadding="small" divider />
      <ListCell label="None" verticalPadding="none" />
    </div>
  ),
};
