import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Category, { CategoryProps } from './Category';

const items = [
  { key: 'cat1', label: '텍스트' },
  { key: 'cat2', label: '텍스트' },
  { key: 'cat3', label: '텍스트' },
  { key: 'cat4', label: '텍스트' },
  { key: 'cat5', label: '텍스트' },
];

const Template = (args: Omit<CategoryProps, 'activeKey' | 'onChange'>) => {
  const [activeKey, setActiveKey] = useState(items[0].key);
  return <Category {...args} items={items} activeKey={activeKey} onChange={setActiveKey} />;
};

const meta: Meta<typeof Category> = {
  title: 'common/Category',
  component: Category,
  render: Template,
};

export default meta;
type Story = StoryObj<typeof Category>;

export const Default: Story = {
  args: {},
};

export const Alternative: Story = {
  args: {
    variant: 'alternative',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const XLarge: Story = {
  args: {
    size: 'xlarge',
  },
};

export const Padding: Story = {
  args: {
    horizontalPadding: true,
    verticalPadding: true,
  },
};
