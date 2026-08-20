import HomePageView from '@/components/home/HomePageView';
import { postsApi } from '@/lib/api/postsApi';
import { mediaApi } from '@/lib/api/mediaApi';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { contactChannelsApi } from '@/lib/api/contactChannelsApi';

export const dynamic = 'force-dynamic';

async function getCategoryPosts(categorySlug: string, limit = 6) {
  try {
    const res = await postsApi.list({
      categorySlug,
      page: 1,
      limit,
    });
    return res.items || [];
  } catch {
    return [];
  }
}

async function getBanners() {
  try {
    return await mediaApi.banners();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [
    guiHangPosts,
    chuyenPhatNhanhPosts,
    camNangPosts,
    carrierPosts,
    banners,
    sidebarBlocks,
    contacts,
  ] = await Promise.all([
    getCategoryPosts('gui-hang-di-nuoc-ngoai', 4),
    getCategoryPosts('chuyen-phat-nhanh', 4),
    getCategoryPosts('cam-nang', 6),
    getCategoryPosts('hang-van-chuyen', 3),
    getBanners(),
    categoriesApi.sidebar().catch(() => []),
    contactChannelsApi.publicList().catch(() => []),
  ]);

  return (
    <HomePageView
      guiHangPosts={guiHangPosts}
      chuyenPhatNhanhPosts={chuyenPhatNhanhPosts}
      camNangPosts={camNangPosts}
      carrierPosts={carrierPosts}
      banners={banners}
      sidebarBlocks={sidebarBlocks}
      contacts={contacts}
    />
  );
}
