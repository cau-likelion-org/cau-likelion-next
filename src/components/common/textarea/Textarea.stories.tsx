import type { Meta, StoryObj } from '@storybook/nextjs';
import Textarea from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'common/Textarea',
  component: Textarea,
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
    resize: {
      control: 'radio',
      options: ['normal', 'limit', 'fixed'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

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

export const Negative: Story = {
  args: {
    heading: '주제',
    status: 'negative',
    defaultValue: '값',
    description: '에러 메시지를 나타내요.',
  },
};

export const Disabled: Story = {
  args: {
    heading: '주제',
    disabled: true,
    placeholder: '텍스트를 입력해 주세요.',
  },
};

export const WithCharacterCount: Story = {
  args: {
    heading: '주제',
    defaultValue: '청춘! 이는 듣기만 하여도 가슴이 설레는 말이다.',
    maxLength: 2000,
    bottomLeadingContent: <span style={{ fontSize: 13, color: 'rgba(55,56,60,0.61)' }}>21/2000</span>,
  },
};

export const FixedResize: Story = {
  args: {
    heading: '주제',
    resize: 'fixed',
    placeholder: '텍스트를 입력해 주세요.',
  },
};
