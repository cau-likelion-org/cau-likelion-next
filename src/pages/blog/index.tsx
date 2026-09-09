import type { ReactElement } from 'react';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import BlogListSection from '@blog/BlogListSection';
import ListPageHead from 'src/components/meta/ListPageHead';

const Blog = () => {
  return (
    <>
      <ListPageHead category="BLOG" canoUrl="https://cau-likelion.org/blog" />
      <BlogListSection />
    </>
  );
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default Blog;
