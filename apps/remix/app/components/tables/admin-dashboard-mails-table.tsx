import { useEffect, useMemo, useState, useTransition } from 'react';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import type { Document, Subscription } from '@prisma/client';
import { Loader, Trash2 } from 'lucide-react';

import { useDebouncedValue } from '@documenso/lib/client-only/hooks/use-debounced-value';
import { useUpdateSearchParams } from '@documenso/lib/client-only/hooks/use-update-search-params';
import type { DataTableColumnDef } from '@documenso/ui/primitives/data-table';
import { DataTable } from '@documenso/ui/primitives/data-table';
import { DataTablePagination } from '@documenso/ui/primitives/data-table-pagination';
import { Input } from '@documenso/ui/primitives/input';

import { WhitelistedMailDeleteDialog } from '../dialogs/whitelist-email-delete-dialog';

type emailsData = {
  email: string;
};

type SubscriptionLite = Pick<
  Subscription,
  'id' | 'status' | 'planId' | 'priceId' | 'createdAt' | 'periodEnd'
>;

type DocumentLite = Pick<Document, 'id'>;

type AdminDashboardMailsTableProps = {
  emails: emailsData[];
  totalPages: number;
  perPage: number;
  page: number;
};

export const AdminDashboardMailsTable = ({
  emails,
  totalPages,
  perPage,
  page,
}: AdminDashboardMailsTableProps) => {
  const { _ } = useLingui();

  const [isPending, startTransition] = useTransition();
  const updateSearchParams = useUpdateSearchParams();
  const [searchString, setSearchString] = useState('');
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const debouncedSearchString = useDebouncedValue(searchString, 1000);

  const columns = useMemo(() => {
    return [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },

      {
        header: _(msg`Email`),
        accessorKey: 'email',
        cell: ({ row }) => <div>{row.original.email}</div>,
      },

      // {
      //   header: _(msg`Action`),
      //   accessorKey: 'Action',
      //   cell: ({ row }) => {

      //     return <Switch className="mt-2" />;
      //   },
      // },
      {
        header: _(msg`Delete`),
        accessorKey: 'Delete',
        cell: ({ row }) => {
          return (
            <Trash2
              color="red"
              className="cursor-pointer"
              onClick={() => {
                setDeleteDialogOpen(true);
                setEmail(row.original.email);
              }}
            />
          );
        },
      },
    ] satisfies DataTableColumnDef<(typeof emails)[number]>[];
  }, []);

  useEffect(() => {
    startTransition(() => {
      updateSearchParams({
        search: debouncedSearchString,
        page: 1,
        perPage,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchString]);

  const onPaginationChange = (page: number, perPage: number) => {
    startTransition(() => {
      updateSearchParams({
        searchString,
        page,
        perPage,
      });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return (
    <div className="relative">
      <Input
        className="my-6 flex flex-row gap-4"
        type="email"
        placeholder={_(msg`Search by email`)}
        value={searchString}
        onChange={handleChange}
      />
      <DataTable
        columns={columns}
        data={emails}
        perPage={perPage}
        currentPage={page}
        totalPages={totalPages}
        onPaginationChange={onPaginationChange}
      >
        {(table) => <DataTablePagination additionalInformation="VisibleCount" table={table} />}
      </DataTable>

      <WhitelistedMailDeleteDialog
        email={email}
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  );
};
