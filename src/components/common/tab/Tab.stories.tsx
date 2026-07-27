import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Tab, { TabProps } from './Tab';

const items = [
  { key: 'tab1', label: '텍스트' },
  { key: 'tab2', label: '텍스트' },
  { key: 'tab3', label: '텍스트' },
];

const Template = (args: Omit<TabProps, 'activeKey' | 'onChange'>) => {
  const [activeKey, setActiveKey] = useState(items[0].key);
  return <Tab {...args} items={items} activeKey={activeKey} onChange={setActiveKey} />;
};

const meta: Meta<typeof Tab> = {
  title: 'common/Tab',
  component: Tab,
  render: Template,
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  args: {},
};

export const Fill: Story = {
  args: {
    resize: 'fill',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const HorizontalPadding: Story = {
  args: {
    horizontalPadding: true,
  },
};
