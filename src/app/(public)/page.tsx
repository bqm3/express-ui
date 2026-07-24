import HomePageView from '@/components/home/HomePageView';
import { postsApi } from '@/lib/api/postsApi';
import { mediaApi } from '@/lib/api/mediaApi';

export const dynamic = 'force-dynamic';

async function getRecentPosts() {
  try {
    return await postsApi.list({
      categorySlug: 'cam-nang',
      page: 1,
      limit: 6,
    });
  } catch {
    return { items: [], page: 1, limit: 6, total: 0, totalPages: 0 };
  }
}

async function getCountryPosts() {
  try {
    return await postsApi.list({
      categorySlug: 'gui-hang-di-nuoc-ngoai',
      page: 1,
      limit: 6,
    });
  } catch {
    return { items: [], page: 1, limit: 6, total: 0, totalPages: 0 };
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
  const [recent, countryPosts, banners] = await Promise.all([
    getRecentPosts(),
    getCountryPosts(),
    getBanners(),
  ]);

  return (
    <HomePageView
      recentPosts={recent.items}
      countryPosts={countryPosts.items}
      banners={banners}
    />
  );
}
