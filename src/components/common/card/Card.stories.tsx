import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Card from './Card';
import ContentBadge from '@common/badge/ContentBadge';

const THUMBNAIL_SRC = '/image/thumbnail-sample.svg';

const meta: Meta<typeof Card> = {
  title: 'common/Card',
  component: Card,
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Desktop: Story = {
  args: {
    thumbnailSrc: THUMBNAIL_SRC,
    overlayCaption: '오버레이 캡션',
    title: '제목',
    caption: '캡션',
  },
};

export const Mobile: Story = {
  args: {
    platform: 'mobile',
    thumbnailSrc: THUMBNAIL_SRC,
    overlayCaption: '오버레이 캡션',
    title: '제목',
    caption: '캡션',
    subCaption: '보조 캡션',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 152 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithAllCaptions: Story = {
  args: {
    thumbnailSrc: THUMBNAIL_SRC,
    overlayCaption: '오버레이 캡션',
    title: '제목',
    caption: '캡션',
    subCaption: '보조 캡션',
    extraCaption: '추가 캡션',
  },
};

const SaveToggleTemplate = () => {
  const [saved, setSaved] = useState(false);
  return (
    <Card
      thumbnailSrc={THUMBNAIL_SRC}
      overlayCaption="오버레이 캡션"
      title="제목"
      caption="캡션"
      saved={saved}
      onToggleSave={() => setSaved((prev) => !prev)}
    />
  );
};

export const WithSaveToggle: Story = {
  render: () => <SaveToggleTemplate />,
};

export const WithoutOverlay: Story = {
  args: {
    thumbnailSrc: THUMBNAIL_SRC,
    thumbnailOverlay: false,
    title: '제목',
    caption: '캡션',
  },
};

export const Clickable: Story = {
  args: {
    thumbnailSrc: THUMBNAIL_SRC,
    overlayCaption: '오버레이 캡션',
    title: '제목',
    caption: '캡션',
    onClick: () => alert('clicked'),
  },
};

export const Skeleton: Story = {
  args: {
    skeleton: true,
    caption: '',
    subCaption: '',
  },
};

export const WithBottomContent: Story = {
  args: {
    thumbnailSrc: THUMBNAIL_SRC,
    overlayCaption: '오버레이 캡션',
    title: '제목',
    caption: '캡션',
    bottomContent: (
      <div style={{ display: 'flex', gap: 6 }}>
        <ContentBadge text="텍스트" color="accent" size="xsmall" />
        <ContentBadge text="텍스트" color="accent" size="xsmall" />
        <ContentBadge text="텍스트" color="accent" size="xsmall" />
      </div>
    ),
  },
};

export const WithTopContent: Story = {
  args: {
    thumbnailSrc: THUMBNAIL_SRC,
    overlayCaption: '오버레이 캡션',
    title: '제목',
    caption: '캡션',
    topContent: (
      <div style={{ display: 'flex', gap: 6 }}>
        <ContentBadge text="텍스트" size="xsmall" />
        <ContentBadge text="텍스트" size="xsmall" />
        <ContentBadge text="텍스트" size="xsmall" />
      </div>
    ),
  },
};
