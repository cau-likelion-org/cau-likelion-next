import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Menu, { MenuProps } from './Menu';

const MenuWithActionArea = (args: MenuProps) => {
  const [leadingValue, setLeadingValue] = useState('');

  return (
    <Menu
      {...args}
      actionArea={{
        leadingPlaceholder: '검색어를 입력하세요',
        leadingValue,
        onLeadingChange: setLeadingValue,
        trailingLabel: '확인',
        onTrailingClick: () => alert(`확인: ${leadingValue}`),
      }}
    />
  );
};

const meta: Meta<typeof Menu> = {
  title: 'common/Menu',
  component: Menu,
  argTypes: {
    variant: {
      control: 'radio',
      options: ['normal', 'radio', 'checkbox'],
    },
    cellPadding: {
      control: 'radio',
      options: [8, 12],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

const baseItems = [
  { label: '첫 번째 항목' },
  { label: '두 번째 항목' },
  { label: '세 번째 항목', disabled: true },
  { label: '네 번째 항목' },
];

export const Default: Story = {
  args: {
    variant: 'normal',
    cellPadding: 8,
    items: baseItems,
  },
};

export const WithCaption: Story = {
  args: {
    variant: 'normal',
    cellPadding: 12,
    items: [
      { label: '첫 번째 항목', caption: '설명' },
      { label: '두 번째 항목', caption: '설명' },
    ],
  },
};

export const Radio: Story = {
  args: {
    variant: 'radio',
    cellPadding: 12,
    items: [{ label: '첫 번째 항목', selected: true }, { label: '두 번째 항목' }, { label: '세 번째 항목' }],
  },
};

export const Checkbox: Story = {
  args: {
    variant: 'checkbox',
    cellPadding: 12,
    items: [
      { label: '첫 번째 항목', selected: true },
      { label: '두 번째 항목', selected: true },
      { label: '세 번째 항목' },
    ],
  },
};

export const WithScroll: Story = {
  args: {
    variant: 'normal',
    cellPadding: 8,
    items: Array.from({ length: 15 }, (_, index) => ({ label: `${index + 1}번째 항목` })),
  },
};

export const WithActionArea: Story = {
  args: {
    variant: 'checkbox',
    cellPadding: 8,
    items: baseItems,
  },
  render: (args) => <MenuWithActionArea {...args} />,
};
