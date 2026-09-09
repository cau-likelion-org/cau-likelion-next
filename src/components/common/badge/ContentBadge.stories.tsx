import type { Meta, StoryObj } from '@storybook/nextjs';
import { MdStar } from 'react-icons/md';
import ContentBadge from './ContentBadge';

const meta: Meta<typeof ContentBadge> = {
  title: 'common/ContentBadge',
  component: ContentBadge,
};

export default meta;
type Story = StoryObj<typeof ContentBadge>;

export const Default: Story = {
  args: {
    text: '텍스트',
  },
};

export const Outlined: Story = {
  args: {
    text: '텍스트',
    variant: 'outlined',
  },
};

export const Accent: Story = {
  args: {
    text: '텍스트',
    color: 'accent',
  },
};

export const AccentOutlined: Story = {
  args: {
    text: '텍스트',
    color: 'accent',
    variant: 'outlined',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <ContentBadge text="텍스트" size="xsmall" />
      <ContentBadge text="텍스트" size="small" />
      <ContentBadge text="텍스트" size="medium" />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    text: '텍스트',
    color: 'accent',
    leadingIcon: <MdStar size={12} />,
    trailingIcon: <MdStar size={12} />,
  },
};
