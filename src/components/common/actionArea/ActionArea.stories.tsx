import type { Meta, StoryObj } from '@storybook/nextjs';
import Button from '../button/Button';
import TextButton from '../textButton/TextButton';
import ActionArea from './ActionArea';

const meta: Meta<typeof ActionArea> = {
  title: 'common/ActionArea',
  component: ActionArea,
  decorators: [
    (Story) => (
      <div style={{ width: '375px', border: '1px solid #eee' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActionArea>;

export const Strong: Story = {
  args: {
    variant: 'strong',
    mainAction: <Button>메인 액션</Button>,
    alternativeAction: (
      <Button variant="outlined" color="assistive">
        대체 액션
      </Button>
    ),
    subAction: <TextButton color="assistive">보조 액션</TextButton>,
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    mainAction: <Button>메인</Button>,
    alternativeAction: (
      <Button variant="outlined" color="assistive">
        대체
      </Button>
    ),
    subAction: (
      <Button variant="outlined" color="assistive">
        보조
      </Button>
    ),
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    mainAction: <Button>메인</Button>,
    alternativeAction: (
      <Button variant="outlined" color="assistive">
        대체
      </Button>
    ),
    subAction: (
      <Button variant="outlined" color="assistive">
        보조
      </Button>
    ),
  },
};

export const CompactWithoutSub: Story = {
  args: {
    variant: 'compact',
    compactContent: true,
    mainAction: <Button>메인</Button>,
    alternativeAction: (
      <Button variant="outlined" color="assistive">
        대체
      </Button>
    ),
    subAction: (
      <Button variant="outlined" color="assistive">
        보조
      </Button>
    ),
  },
};

export const Cancel: Story = {
  args: {
    variant: 'cancel',
    mainAction: (
      <Button variant="outlined" color="assistive">
        확인
      </Button>
    ),
  },
};

export const WithCaption: Story = {
  args: {
    variant: 'strong',
    caption: '필요한 경우 설명을 덧붙입니다.',
    mainAction: <Button>메인 액션</Button>,
  },
};

export const WithDividerAndExtra: Story = {
  args: {
    variant: 'strong',
    divider: true,
    extra: <div style={{ height: 72, background: 'rgba(101,65,242,0.08)', width: '100%' }} />,
    mainAction: <Button>메인 액션</Button>,
  },
};
