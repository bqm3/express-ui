import PublicShell from '@/components/layout/PublicShell';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { contactChannelsApi } from '@/lib/api/contactChannelsApi';
import { settingsApi } from '@/lib/api/settingsApi';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menu, contacts, settings] = await Promise.all([
    categoriesApi.menu().catch(() => []),
    contactChannelsApi.publicList().catch(() => []),
    settingsApi.getPublicSettings().catch(() => ({})),
  ]);

  return (
    <PublicShell initialMenu={menu} initialContacts={contacts} initialSettings={settings}>
      {children}
    </PublicShell>
  );
}

