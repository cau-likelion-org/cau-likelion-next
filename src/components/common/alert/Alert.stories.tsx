import type { Meta, StoryObj } from '@storybook/nextjs';
import Alert from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'common/Alert',
  component: Alert,
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    heading: '간략한 제목',
    body: '목적을 명확하고 간단히 안내합니다.',
    actions: [
      { label: '보조 행동', variant: 'assistive', onClick: () => alert('보조 행동') },
      { label: '권장 행동', variant: 'primary', onClick: () => alert('권장 행동') },
    ],
  },
};

export const WithoutHeading: Story = {
  args: {
    body: '목적을 명확하고 간단히 안내합니다.',
    actions: [{ label: '확인', variant: 'primary', onClick: () => alert('확인') }],
  },
};

export const NegativeAction: Story = {
  args: {
    heading: '계정을 삭제할까요?',
    body: '삭제된 계정은 복구할 수 없습니다.',
    actions: [
      { label: '취소', variant: 'assistive', onClick: () => alert('취소') },
      { label: '삭제', variant: 'negative', onClick: () => alert('삭제') },
    ],
  },
};
