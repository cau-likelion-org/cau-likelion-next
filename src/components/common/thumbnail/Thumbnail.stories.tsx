import type { Meta, StoryObj } from '@storybook/nextjs';
import Thumbnail from './Thumbnail';

const PLACEHOLDER_SRC = '/image/thumbnail-sample.svg';

const meta: Meta<typeof Thumbnail> = {
  title: 'common/Thumbnail',
  component: Thumbnail,
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Thumbnail>;

export const Default: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    alt: '썸네일',
  },
};

export const Rounded: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    alt: '썸네일',
    radius: true,
  },
};

export const Bordered: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    alt: '썸네일',
    radius: true,
    border: true,
  },
};

export const WideRatio: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    alt: '썸네일',
    radius: true,
    ratio: 16 / 9,
  },
};

export const WithOverlay: Story = {
  args: {
    src: PLACEHOLDER_SRC,
    alt: '썸네일',
    radius: true,
    overlay: (
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#fff', fontSize: 13 }}>N장</span>
      </div>
    ),
  },
};
