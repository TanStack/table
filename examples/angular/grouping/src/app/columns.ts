import { tableHelper } from './app.component'

const { columnHelper } = tableHelper

export const columns = columnHelper.columns([
  columnHelper.group({
    header: 'Name',
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: () => 'First Name',
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
      }),
      columnHelper.group({
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => `Visits`,
            aggregationFn: 'sum',
            aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
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
          }),
        ]),
      }),
    ]),
  }),
])
