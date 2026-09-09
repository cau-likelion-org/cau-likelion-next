import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Radio from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'common/Radio',
  component: Radio,
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

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

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = useState('a');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Radio name="group" value="a" label="옵션 A" checked={selected === 'a'} onChange={() => setSelected('a')} />
        <Radio name="group" value="b" label="옵션 B" checked={selected === 'b'} onChange={() => setSelected('b')} />
        <Radio name="group" value="c" label="옵션 C" checked={selected === 'c'} onChange={() => setSelected('c')} />
      </div>
    );
  },
};
