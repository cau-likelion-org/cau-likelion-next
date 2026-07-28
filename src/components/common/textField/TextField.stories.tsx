import type { Meta, StoryObj } from '@storybook/nextjs';
import TextField from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'common/TextField',
  component: TextField,
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
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    heading: '주제',
    placeholder: '텍스트를 입력해 주세요.',
    description: '메시지에 마침표를 찍어요.',
  },
};

export const Required: Story = {
  args: {
    heading: '주제',
    required: true,
    placeholder: '텍스트를 입력해 주세요.',
  },
};

export const Positive: Story = {
  args: {
    heading: '주제',
    status: 'positive',
    defaultValue: '값',
    description: '성공 메시지를 나타내요.',
  },
};

export const Negative: Story = {
  args: {
    heading: '주제',
    status: 'negative',
    placeholder: '텍스트를 입력해 주세요.',
    description: '에러 메시지를 나타내요.',
  },
};

export const Disabled: Story = {
  args: {
    heading: '주제',
    disabled: true,
    placeholder: '텍스트를 입력해 주세요.',
    description: '메시지에 마침표를 찍어요.',
  },
};

export const WithTrailingButton: Story = {
  args: {
    heading: '주제',
    placeholder: '텍스트를 입력해 주세요.',
    trailingButton: { label: '중복확인' },
  },
};

export const NoHeadingNoDescription: Story = {
  args: {
    placeholder: '텍스트를 입력해 주세요.',
  },
};
