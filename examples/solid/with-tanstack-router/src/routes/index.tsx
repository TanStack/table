import { keepPreviousData, useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { fetchUsers } from '../api/user'
import Table, {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '../components/table'
import { useFilters } from '../hooks/useFilters'
import { sortByToState, stateToSortBy } from '../utils/tableSortMapper'
import { USER_COLUMNS } from '../utils/userColumns'
import type { UserFilters } from '../api/user'

export const Route = createFileRoute('/')({
  component: UsersPage,
  validateSearch: () => ({}) as UserFilters,
})

function UsersPage() {
  const { filters, resetFilters, setFilters } = useFilters(Route.fullPath)

  const dataQuery = useQuery(() => ({
    queryKey: ['users', filters()],
    queryFn: () => fetchUsers(filters()),
    placeholderData: keepPreviousData,
  }))

  const paginationState = () => ({
    pageIndex: filters().pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters().pageSize ?? DEFAULT_PAGE_SIZE,
  })

  const sortingState = () => sortByToState(filters().sortBy)

  return (
    <div class="flex flex-col gap-2 p-2">
      <h1 class="text-2xl font-semibold mb-1">
        TanStack Table + Query + Router
      </h1>
      <Table
        data={dataQuery.data?.result ?? []}
        columns={USER_COLUMNS}
        pagination={paginationState()}
        paginationOptions={{
          onPaginationChange: (pagination) => {
            setFilters(
              typeof pagination === 'function'
                ? pagination(paginationState())
                : pagination,
            )
          },
          rowCount: dataQuery.data?.rowCount,
        }}
        filters={filters()}
        onFilterChange={(newFilters) =>
          setFilters({ ...newFilters, pageIndex: DEFAULT_PAGE_INDEX })
        }
        sorting={sortingState()}
        onSortingChange={(updaterOrValue) => {
          const newSortingState =
            typeof updaterOrValue === 'function'
              ? updaterOrValue(sortingState())
              : updaterOrValue
          return setFilters({
            sortBy: stateToSortBy(newSortingState),
            pageIndex: DEFAULT_PAGE_INDEX,
          })
        }}
      />
      <div class="flex items-center gap-2">
        {dataQuery.data?.rowCount?.toLocaleString()} users found
        <button
          class="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={resetFilters}
          disabled={Object.keys(filters()).length === 0}
        >
          Reset Filters
        </button>
      </div>
      <pre>{JSON.stringify(filters(), null, 2)}</pre>
    </div>
  )
}
