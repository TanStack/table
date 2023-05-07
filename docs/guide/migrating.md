---
title: Migrating to V8
---

## Migrating to V8

TanStack Table V8 was a major rewrite of React Table v7 from the ground up in TypeScript. The overall structure/organization of your markup and CSS will largely remain the same, but many of the APIs have been renamed or replaced.

### Notable Changes

- Full rewrite to TypeScript with types included in the base package
- Removal of plugin system to favor more inversion of control
- Vastly larger and improved API (and new features like pinning)
- Better controlled state management
- Better support for server-side operations
- Complete (but optional) data pipeline control
- Agnostic core with framework adapters for React, Solid, Svelte, Vue, and potentially more in the future
- New Dev Tools

### Install the new Version

The new version of TanStack Table is published under the `@tanstack` scope. Install the new package using your favorite package manager:

```bash
npm uninstall react-table @types/react-table
npm install @tanstack/react-table
```

```diff
- import { useTable } from 'react-table'
+ import { useReactTable } from '@tanstack/react-table'
```

Types are now included in the base package, so you can remove the `@types/react-table` package.

> If you want, you can keep the old `react-table` packages installed so that you can gradually migrate your code. You should be able to use both packages side-by-side for separate tables without any issues.

### Update Table Options

- Rename `useTable` to `useReactTable`
- The old hook and plugin systems have been removed, but they have replaced with tree-shakable row model imports for each feature.

```diff
- import { useTable, usePagination, useSortBy } from 'react-table';
+ import {
+   useReactTable,
+   getCoreRowModel,
+   getPaginationRowModel,
+   getSortedRowModel
+ } from '@tanstack/react-table';

// ...

-   const tableInstance = useTable(
-     { columns,  data },
-     useSortBy,
-     usePagination, //order of hooks used to matter
-     // etc.
-   );
+   const tableInstance = useReactTable({
+     columns,
+     data,
+     getCoreRowModel: getCoreRowModel(),
+     getPaginationRowModel: getPaginationRowModel(),
+     getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore!
+     // etc.
+   });
```

- All `disable*` table options were renamed to `enable*` table options. (e.g. `disableSortBy` is now `enableSorting`, `disableGroupBy` is now `enableGrouping`, etc.)
- ...

### Update column definitions

- accessor was renamed to either `accessorKey` or `accessorFn` (depending on whether you are using a string or function)
- Optionally, you can use the new `createColumnHelper` function around each column definition for better TypeScript hints. (You can still just use an array of column definitions if you prefer.)
  - The first parameter is the accessor function or accessor string.
  - The second parameter is an object of column options.

```diff
const columns = [
-  {
-    accessor: 'firstName',
-    Header: 'First Name',
-  },
-  {
-    accessor: row => row.lastName,
-    Header: () => <span>Last Name</span>,
-  },

// Best TypeScript experience, especially when using `cell.getValue()` later on
+  columnHelper.accessor('firstName', { //accessorKey
+    header: 'First Name',
+  }),
+  columnHelper.accessor(row => row.lastName, { //accessorFn
+    header: () => <span>Last Name</span>,
+  }),

// OR (if you prefer)
+ {
+   accessorKey: 'firstName',
+   header: 'First Name',
+ },
+ {
+   accessorFn: row => row.lastName,
+   header: () => <span>Last Name</span>,
+ },
]
```

> Note: If defining columns inside a component, you should still try to give the column definitions a stable identity. This will help with performance and prevent unnecessary re-renders. Store the column definitions in either a `useMemo` or `useState` hook.

- Column Option Name Changes

  - `Header` was renamed to `header`
  - `Cell` was renamed to `cell` (The cell render function has also changed. See below)
  - `Footer` was renamed to `footer`
  - All `disable*` column options were renamed to `enable*` column options. (e.g. `disableSortBy` is now `enableSorting`, `disableGroupBy` is now `enableGrouping`, etc.)
  - `sortType` `sortingFn`
  - ...

- Changes to custom cell renderers

  - `value` was renamed `getValue` (Throughout the upgrade, instead of providing the value directly, a function `getValue` is exposed for evaluating the value. This change aims to improve performance by evaluating the value only when `getValue()` is called and then caching it.)
  - `cell: { isGrouped, isPlaceholder, isAggregated }` is now `cell: { getIsGrouped, getIsPlaceholder, getIsAggregated }`
  - `column`: The base level props are now RT-specific. Values that you added to the object when defining it are now one level deeper in `columnDef`.
  - `table`: Props passed into the `useTable` hook now appear under `options`.

### Migrate Table Markup

- Use `flexRender()` instead of `cell.render('Cell')` or `column.render('Header')`, etc.
- `getHeaderProps`, `getFooterProps`, `getCellProps`, `getRowProps`, etc. have all been _deprecated_.
  - TanStack Table does not provide any default `style` or accessibility attributes like `role` anymore. These are still important for you to get right, but it had to be removed in order to support being framework-agnostic.
  - You will need to define `onClick` handlers manually, but there are new `get*Handler` helpers to keep this simple.
  - You will need to define the `key` props manually
  - You will need to define the `colSpan` prop manually if using features that require it (grouped headers, aggregation, etc.)

```diff
- <th {...header.getHeaderProps()}>{cell.render('Header')}</th>
+ <th colSpan={header.colSpan} key={column.id}>
+   {flexRender(
+     header.column.columnDef.header,
+     header.getContext()
+   )}
+ </th>
```

```diff
- <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
+ <td key={cell.id}>
+   {flexRender(
+     cell.column.columnDef.cell,
+     cell.getContext()
+   )}
+ </td>
```

```diff
// in column definitions in this case
- Header: ({ getToggleAllRowsSelectedProps }) => (
-   <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
- ),
- Cell: ({ row }) => (
-   <input type="checkbox" {...row.getToggleRowSelectedProps()} />
- ),
+ header: ({ table }) => (
+   <Checkbox
+     checked={table.getIsAllRowsSelected()}
+     indeterminate={table.getIsSomeRowsSelected()}
+     onChange={table.getToggleAllRowsSelectedHandler()}
+   />
+ ),
+ cell: ({ row }) => (
+   <Checkbox
+     checked={row.getIsSelected()}
+     disabled={!row.getCanSelect()}
+     indeterminate={row.getIsSomeSelected()}
+     onChange={row.getToggleSelectedHandler()}
+   />
+ ),
```

### Other Changes

- custom `filterTypes` (now called `filterFns`) have a new function signature as it only returns a boolean for whether the row should be included or not.

```diff
- (rows: Row[], id: string, filterValue: any) => Row[]
+ (row: Row, id: string, filterValue: any) => boolean
```

- ...

> This guide is a work in progress. Please consider contributing to it if you have time!
