import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'common/Checkbox',
  component: Checkbox,
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: {
    label: '텍스트',
  },
};

export const Checked: Story = {
  args: {
    label: '텍스트',
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: '텍스트',
    indeterminate: true,
  },
};

export const Small: Story = {
  args: {
    label: '텍스트',
    size: 'small',
    checked: true,
  },
};

export const Bold: Story = {
  args: {
    label: '텍스트',
    bold: true,
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: '텍스트',
    disabled: true,
    checked: true,
  },
};

export const NoLabel: Story = {
  args: {
    checked: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Checkbox label="텍스트" checked={checked} onChange={setChecked} />;
  },
};
