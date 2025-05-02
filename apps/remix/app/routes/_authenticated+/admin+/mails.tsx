import { useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { useSearchParams } from 'react-router';

import { useDebouncedValue } from '@documenso/lib/client-only/hooks/use-debounced-value';
import { useSession } from '@documenso/lib/client-only/providers/session';
import { findUsers } from '@documenso/lib/server-only/user/get-all-users';
import { trpc } from '@documenso/trpc/react';

import { WhitelistEmailCreateDialog } from '~/components/dialogs/whitelist-mails-create';
import { AdminDashboardMailsTable } from '~/components/tables/admin-dashboard-mails-table';

import type { Route } from './+types/users._index';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get('page')) || 1;
  const perPage = Number(url.searchParams.get('perPage')) || 10;
  const search = url.searchParams.get('search') || '';

  const [{ users, totalPages }] = await Promise.all([
    findUsers({ username: search, email: search, page, perPage }),
    // getPricesByPlan([STRIPE_PLAN_TYPE.REGULAR, STRIPE_PLAN_TYPE.COMMUNITY]).catch(() => []),
  ]);

  // const individualPriceIds = individualPrices.map((price) => price.id);

  return {
    users,
    totalPages,
    // individualPriceIds,
    page,
    perPage,
  };
}

export default function AdminWhitelistPage() {
  const [searchParams] = useSearchParams();

  const { user, refreshSession } = useSession();

  const [term, setTerm] = useState(() => searchParams?.get?.('term') ?? '');
  const debouncedTerm = useDebouncedValue(term, 500);

  const page = searchParams?.get?.('page') ? Number(searchParams.get('page')) : undefined;
  const perPage = searchParams?.get?.('perPage') ? Number(searchParams.get('perPage')) : undefined;
  const search = searchParams?.get?.('search') ? String(searchParams.get('search')) : undefined;

  // console.log(search, '===search===');

  const { data: viewAllWhitelistedEmail, isPending: isFindDocumentsLoading } =
    trpc.admin.viewAllWhitelistedEmail.useQuery({
      search: search !== undefined ? String(search) : undefined,
      page: page || 1,
      perPage: perPage || 20,
    });

  const results = viewAllWhitelistedEmail ?? {
    emails: [],
    perPage: 10,
    currentPage: 1,
    totalPages: 1,
  };

  const fiteredEmails = results.emails.filter(
    (item: { email: string }) => item?.email !== user.email,
  );
  // console.log(fiteredEmails, user.email, '====== Result ======');

  // const createUser = trpc.admin.viewAllWhitelistedEmail.useMutation();

  // useEffect(() => {

  // }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-4xl font-semibold">
          <Trans>Whitelisted Mails</Trans>
        </h2>

        <div>
          <WhitelistEmailCreateDialog />
        </div>
      </div>

      <AdminDashboardMailsTable
        emails={fiteredEmails}
        totalPages={results?.totalPages ?? 1}
        page={page ?? 1}
        perPage={perPage ?? 10}
      />
    </div>
  );
}
