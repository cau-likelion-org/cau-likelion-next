import { ReactElement, ReactNode, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Generation } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import LeaveConfirmAlert from '@common/alert/LeaveConfirmAlert';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import MyPageShell from '@mypage/component/MyPageShell';
import SitePageEditor from '@mypage/admin/component/SitePageEditor';
import CircularLoading from '@common/loading/CircularLoading';
import BlogSection, {
  BlogItem,
  BLOG_CATEGORY_LABEL,
  BLOG_CATEGORY_BY_LABEL,
  isBlogItemInvalid,
} from '@mypage/admin/blog/BlogSection';
import { syncListSection } from '@mypage/admin/utils';
import useLeaveGuard from 'src/hooks/useLeaveGuard';
import useRequiredFieldsSave from 'src/hooks/useRequiredFieldsSave';
import { getGenerations } from 'src/apis/account';
import { getBlogs, createBlog, updateBlog, deleteBlog, BlogResponse, BlogRequest } from 'src/apis/blog';
import useRoleGuard from 'src/apis/useRoleGuard';
import useTokenStore from 'src/store/useTokenStore';
import { canManageSitePages, getServerMessage } from '@utils/index';

const blogToLocal = (blog: BlogResponse): BlogItem => ({
  id: String(blog.id),
  generation: String(blog.generationNumber),
  writer: blog.writer,
  category: BLOG_CATEGORY_LABEL[blog.category],
  url: blog.url,
});

const buildBlogToRequest =
  (generations: Generation[]) =>
  (item: BlogItem): BlogRequest => {
    const generation = generations.find((candidate) => candidate.number === Number(item.generation));
    return {
      generationId: generation?.id ?? 0,
      writer: item.writer,
      url: item.url,
      category: BLOG_CATEGORY_BY_LABEL[item.category],
    };
  };

const isBlogGenerationInvalid = (item: BlogItem, generations: Generation[]) =>
  !generations.some((generation) => generation.number === Number(item.generation));

const MyPageAdminBlog = () => {
  const tokenState = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();

  const { isAuthorized, isUserProfileError } = useRoleGuard(canManageSitePages);

  // 편집 화면이라 창 포커스 시 백그라운드 재조회로 입력 중인 값이 덮어써지지 않도록 자동 재조회를 끔
  const { data: blogs, isError: isBlogsError } = useQuery({
    queryKey: ['adminBlogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
  });
  const { data: generations, isError: isGenerationsError } = useQuery({
    queryKey: ['generations'],
    queryFn: getGenerations,
    refetchOnWindowFocus: false,
  });
  const isDataLoaded = blogs !== undefined && generations !== undefined;
  const isDataError = isBlogsError || isGenerationsError;

  const [blogItems, setBlogItems] = useState<BlogItem[]>(() => (blogs ?? []).map(blogToLocal));
  const [toastMessage, setToastMessage] = useState<ReactNode>('');
  const [toastVariant, setToastVariant] = useState<'positive' | 'negative'>('positive');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const { showErrors, validate, hideErrors } = useRequiredFieldsSave(contentRef);

  // 조회된 데이터가 바뀌면(최초 로드, 저장 후 재조회) 화면 편집 상태를 다시 그 값으로 맞춤
  const [syncedBlogs, setSyncedBlogs] = useState(blogs);
  if (blogs !== syncedBlogs) {
    setSyncedBlogs(blogs);
    if (!isEditing) {
      setBlogItems((blogs ?? []).map(blogToLocal));
    }
  }

  const { isConfirmOpen, confirmLeave, cancelLeave } = useLeaveGuard(
    isEditing && JSON.stringify(blogItems) !== JSON.stringify((blogs ?? []).map(blogToLocal)),
  );

  const handleCancel = () => {
    setBlogItems((blogs ?? []).map(blogToLocal));
    hideErrors();
    setIsEditing(false);
  };

  const handleSave = async () => {
    const hasError =
      blogItems.some(isBlogItemInvalid) || blogItems.some((item) => isBlogGenerationInvalid(item, generations ?? []));

    if (!validate(hasError)) return;
    setIsSaving(true);
    try {
      await syncListSection({
        currentItems: blogItems,
        originalItems: blogs ?? [],
        toLocal: blogToLocal,
        toRequest: buildBlogToRequest(generations ?? []),
        create: (form) => createBlog(tokenState, form),
        update: (id, form) => updateBlog(tokenState, id, form),
        remove: (id) => deleteBlog(tokenState, id),
      });
      await queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      setToastVariant('positive');
      setToastMessage('변경사항이 저장되었습니다.');
      setIsEditing(false);
    } catch (error) {
      setToastVariant('negative');
      setToastMessage(getServerMessage(error) ?? '저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <SitePageEditor
        title="블로그 페이지 관리"
        isAuthorized={isAuthorized}
        isUserProfileError={isUserProfileError}
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={() => setIsEditing(true)}
        onCancel={handleCancel}
        onSave={handleSave}
        isDataError={isDataError}
        isDataLoaded={isDataLoaded}
        loadingIndicator={<CircularLoading size={32} />}
        contentRef={contentRef}
      >
        <BlogSection items={blogItems} onChange={setBlogItems} showErrors={showErrors} disabled={!isEditing} />
      </SitePageEditor>
      {isConfirmOpen && <LeaveConfirmAlert onCancel={cancelLeave} onConfirm={confirmLeave} />}
      <ToastWrapper>
        <Toast variant={toastVariant} text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
    </>
  );
};

MyPageAdminBlog.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFullWidth>
      <MyPageShell active="admin-blog">{page}</MyPageShell>
    </LayoutFullWidth>
  );
};

export default MyPageAdminBlog;
