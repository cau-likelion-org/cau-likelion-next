import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { MdKeyboardArrowDown } from 'react-icons/md';
import PaginationNavigation, { PaginationNavigationProps } from './PaginationNavigation';

const Template = (args: Omit<PaginationNavigationProps, 'currentPage' | 'onPageChange'>) => {
  const [currentPage, setCurrentPage] = useState(1);
  return <PaginationNavigation {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
};

// Example composition matching the Figma default — a real implementation
// would swap these for the project's own Select / TextField components.
const PageSizeChip = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        padding: '6px 6px 6px 8px',
        border: '1px solid rgba(112, 115, 124, 0.16)',
        borderRadius: 8,
        background: 'none',
        fontSize: 14,
        color: '#171719',
      }}
    >
      10
      <MdKeyboardArrowDown size={16} />
    </button>
    <span style={{ fontSize: 13, color: 'rgba(55, 56, 60, 0.61)' }}>씩 보기</span>
  </div>
);

const JumpToPageField = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ fontSize: 13, color: 'rgba(55, 56, 60, 0.61)' }}>페이지 이동</span>
    <input
      defaultValue={23}
      style={{
        width: 53,
        padding: '4px 6px',
        border: '1px solid rgba(112, 115, 124, 0.16)',
        borderRadius: 12,
        boxShadow: '0px 1px 2px -1px rgba(23, 23, 23, 0.1)',
        fontSize: 14,
        textAlign: 'center',
      }}
    />
  </div>
);

const meta: Meta<typeof PaginationNavigation> = {
  title: 'common/PaginationNavigation',
  component: PaginationNavigation,
  render: Template,
};

export default meta;
type Story = StoryObj<typeof PaginationNavigation>;

export const Extended: Story = {
  args: {
    totalPage: 11,
    leadingContent: <PageSizeChip />,
    trailingContent: <JumpToPageField />,
  },
};

export const ExtendedManyPages: Story = {
  args: {
    totalPage: 50,
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    totalPage: 7,
  },
};

export const CompactManyPages: Story = {
  args: {
    variant: 'compact',
    totalPage: 50,
  },
};

export const Minimize: Story = {
  args: {
    variant: 'minimize',
    totalPage: 10,
  },
};

export const WithoutSideContent: Story = {
  args: {
    totalPage: 11,
  },
};
