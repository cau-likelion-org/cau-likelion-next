import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import SegmentedControl from './SegmentedControl';

const options = [
  { label: '텍스트', value: 'a' },
  { label: '텍스트', value: 'b' },
  { label: '텍스트', value: 'c' },
];

const meta: Meta<typeof SegmentedControl> = {
  title: 'common/SegmentedControl',
  component: SegmentedControl,
  decorators: [
    (Story) => (
      <div style={{ width: '335px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['filled', 'outlined'],
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Filled: Story = {
  render: (args) => {
    const [value, setValue] = useState('a');
    return <SegmentedControl {...args} options={options} value={value} onChange={setValue} />;
  },
  args: {
    variant: 'filled',
    size: 'large',
  },
};

export const Outlined: Story = {
  render: (args) => {
    const [value, setValue] = useState('a');
    return <SegmentedControl {...args} options={options} value={value} onChange={setValue} />;
  },
  args: {
    variant: 'outlined',
    size: 'large',
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState('a');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl size="small" options={options} value={value} onChange={setValue} />
        <SegmentedControl size="medium" options={options} value={value} onChange={setValue} />
        <SegmentedControl size="large" options={options} value={value} onChange={setValue} />
      </div>
    );
  },
};
