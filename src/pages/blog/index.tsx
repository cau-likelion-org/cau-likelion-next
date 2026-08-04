import type { ReactElement } from 'react';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import BlogListSection from '@blog/BlogListSection';

const Blog = () => {
  return <BlogListSection />;
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default Blog;
