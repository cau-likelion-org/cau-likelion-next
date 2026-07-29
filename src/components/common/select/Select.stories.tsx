import type { Meta, StoryObj } from '@storybook/nextjs';
import Select from './Select';

const meta: Meta<typeof Select> = {
  title: 'common/Select',
  component: Select,
  decorators: [
    (Story) => (
      <div style={{ width: '335px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    status: {
      control: 'radio',
      options: ['normal', 'positive', 'negative'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Placeholder: Story = {
  args: {
    heading: '주제',
    placeholder: '선택해주세요.',
    description: '메시지에 마침표를 찍어요.',
  },
};

export const WithValue: Story = {
  args: {
    heading: '주제',
    value: '값',
  },
};

export const WithChips: Story = {
  args: {
    heading: '주제',
    chips: [
      { label: '텍스트', onRemove: () => {} },
      { label: '텍스트', onRemove: () => {} },
      { label: '텍스트', onRemove: () => {} },
    ],
  },
};

export const Negative: Story = {
  args: {
    heading: '주제',
    status: 'negative',
    placeholder: '선택해주세요.',
    description: '에러 메시지를 나타내요.',
  },
};

export const Disabled: Story = {
  args: {
    heading: '주제',
    disabled: true,
    placeholder: '선택해주세요.',
  },
};
