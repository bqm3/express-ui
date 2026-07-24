import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PostListView from '@/components/posts/PostListView';
import PostDetailView from '@/components/posts/PostDetailView';
import PostLienHe from '@/components/posts/PostLienHe';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { isContactPageSlug } from '@/lib/site';
import type { ResolveSlugResult } from '@/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const reserved = ['tra-cuu', 'danh-muc', 'admin'];

async function resolveSlug(
  slug: string,
  page: number,
): Promise<ResolveSlugResult | null> {
  try {
    return await categoriesApi.resolve(slug, { page, limit: 12 });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  if (reserved.includes(slug)) {
    return { title: 'Không tìm thấy' };
  }

  const page = Math.max(1, Number(sp.page) || 1);
  const resolved = await resolveSlug(slug, page);
  if (!resolved) return { title: 'Không tìm thấy' };

  if (resolved.type === 'single_post') {
    const post = resolved.post;
    const title = post.ogTitle || post.metaTitle || post.title;
    const description =
      post.ogDescription ||
      post.metaDescription ||
      post.shortDescription ||
      'Glexpress — dịch vụ gửi hàng đi nước ngoài';
    const image = post.ogImage || post.thumbnail || undefined;
    const robots = post.robotsMeta || 'index,follow';

    return {
      title,
      description,
      keywords: post.metaKeywords || post.focusKeyword || undefined,
      robots,
      alternates: post.canonicalUrl
        ? { canonical: post.canonicalUrl }
        : undefined,
      openGraph: {
        title: post.ogTitle || title,
        description: post.ogDescription || description,
        images: image ? [{ url: image }] : undefined,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.twitterTitle || title,
        description: post.twitterDescription || description,
        images:
          post.twitterImage || image
            ? [post.twitterImage || image!]
            : undefined,
      },
    };
  }

  if (isContactPageSlug(resolved.category.slug)) {
    return {
      title: `${resolved.category.name} | Glexpress`,
      description:
        resolved.category.shortDescription ||
        resolved.category.content?.replace(/<[^>]+>/g, '').slice(0, 160) ||
        'Liên hệ Glexpress — tư vấn gửi hàng đi nước ngoài',
    };
  }

  return {
    title: `${resolved.category.name} | Glexpress`,
    description:
      resolved.category.content?.replace(/<[^>]+>/g, '').slice(0, 160) ||
      `Danh sách bài viết chuyên mục ${resolved.category.name}`,
  };
}

export default async function SlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  if (reserved.includes(slug)) {
    notFound();
  }

  const page = Math.max(1, Number(sp.page) || 1);
  const resolved = await resolveSlug(slug, page);
  if (!resolved) notFound();

  if (resolved.type === 'single_post') {
    return (
      <PostDetailView
        post={resolved.post}
        related_posts={resolved.related_posts}
      />
    );
  }

  if (isContactPageSlug(resolved.category.slug)) {
    return <PostLienHe category={resolved.category} />;
  }

  return (
    <Suspense fallback={null}>
      <PostListView
        category={resolved.category}
        posts={resolved.posts}
        pagination={resolved.pagination}
      />
    </Suspense>
  );
}
