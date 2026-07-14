import {
  aggregationFeature,
  aggregationFn_mean,
  aggregationFn_median,
  aggregationFn_sum,
  columnFilteringFeature,
  columnGroupingFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createTableHook,
  rowExpandingFeature,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import type { Person } from './makeData'

const features = tableFeatures({
  aggregationFeature,
  columnGroupingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  rowExpandingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  aggregationFns: {
    mean: aggregationFn_mean,
    median: aggregationFn_median,
    sum: aggregationFn_sum,
  },
})

export const { createAppColumnHelper, injectAppTable: injectTable } =
  createTableHook({
    features,
  })
const columnHelper = createAppColumnHelper<Person>()

export const columns = columnHelper.columns([
  columnHelper.group({
    header: 'Name',
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: () => 'First Name',
        footer: 'Grand Total',
        cell: (info) => info.getValue(),
        getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        header: () => 'Last Name',
        cell: (info) => info.getValue(),
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Info',
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
        aggregatedCell: ({ getValue }) =>
          Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'median',
        footer: ({ column }) => {
          const value = column.getAggregationValue<number | undefined>()
          return value === undefined ? '' : Math.round(value * 100) / 100
        },
      }),
      columnHelper.group({
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => `Visits`,
            aggregationFn: 'sum',
            aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
            footer: ({ column }) =>
              column.getAggregationValue<number>().toLocaleString(),
          }),
          columnHelper.accessor('status', {
            header: 'Status',
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            cell: ({ getValue }) =>
              Math.round(getValue<number>() * 100) / 100 + '%',
            aggregationFn: 'mean',
            aggregatedCell: ({ getValue }) =>
              Math.round(getValue<number>() * 100) / 100 + '%',
            footer: ({ column }) => {
              const value = column.getAggregationValue<number | undefined>()
              return value === undefined
                ? ''
                : `${Math.round(value * 100) / 100}%`
            },
          }),
        ]),
      }),
    ]),
  }),
])
