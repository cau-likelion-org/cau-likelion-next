import type { Meta, StoryObj } from '@storybook/nextjs';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'common/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'radio',
      options: ['solid', 'outlined'],
    },
    color: {
      control: 'radio',
      options: ['primary', 'assistive'],
    },
    size: {
      control: 'radio',
      options: ['large', 'medium', 'small'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'large',
    children: '해당 액션',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    size: 'large',
    children: '대체 액션',
  },
};

export const Assistive: Story = {
  args: {
    variant: 'solid',
    color: 'assistive',
    size: 'large',
    children: '대체 액션',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button size="large">Large</Button>
      <Button size="medium">Medium</Button>
      <Button size="small">Small</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'large',
    disabled: true,
    children: '해당 액션',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    size: 'large',
    disabled: true,
    children: '대체 액션',
  },
};

export const Loading: Story = {
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'large',
    loading: true,
    children: '해당 액션',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'large',
    iconOnly: true,
    icon: <span aria-hidden>★</span>,
    'aria-label': '즐겨찾기',
  },
};
