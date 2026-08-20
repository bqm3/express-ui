import PublicShell from '@/components/layout/PublicShell';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { contactChannelsApi } from '@/lib/api/contactChannelsApi';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menu, contacts] = await Promise.all([
    categoriesApi.menu().catch(() => []),
    contactChannelsApi.publicList().catch(() => []),
  ]);

  return (
    <PublicShell initialMenu={menu} initialContacts={contacts}>
      {children}
    </PublicShell>
  );
}
