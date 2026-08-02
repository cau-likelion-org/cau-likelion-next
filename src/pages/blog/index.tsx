import type { ReactElement } from 'react';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import BlogListSection from '@blog/BlogListSection';

const Blog = () => {
  return <BlogListSection />;
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export default Blog;
