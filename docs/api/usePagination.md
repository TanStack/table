# `usePagination`

- Plugin Hook
- Optional

`usePagination` is the hook that implements **row pagination**. It can be used for both client-side pagination or server-side pagination. For more information on pagination, see Pagination

> **NOTE** Some server-side pagination implementations do not use page index and instead use **token based pagination**! If that's the case, please use the `useTokenPagination` plugin instead.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `state.pageSize: Int`
  - **Required**
  - Defaults to `10`
  - Determines the amount of rows on any given page
- `initialState.pageSize`
  - Identical to the `state.pageSize` option above
- `state.pageIndex: Int`
  - **Required**
  - Defaults to `0`
  - The index of the page that should be displayed via the `page` instance value
- `initialState.pageIndex`
  - Identical to the `state.pageIndex` option above
- `pageCount: Int`
  - **Required if `manualPagination` is set to `true`**
  - If `manualPagination` is `true`, then this value used to determine the amount of pages available. This amount is then used to materialize the `pageOptions` and also compute the `canNextPage` values on the table instance.
- `manualPagination: Bool`
  - Enables pagination functionality, but does not automatically perform row pagination.
  - Turn this on if you wish to implement your own pagination outside of the table (eg. server-side pagination or any other manual pagination technique)
- `getResetPageDeps: Function(instance) => [...useEffectDependencies]`
  - Optional
  - Defaults to resetting the `pageIndex` to `0` when the dependencies below change
    - ```js
      const getResetPageDeps = ({
        rows,
        manualPagination,
        state: { filters, groupBy, sortBy },
      }) => [manualPagination ? null : rows, filters, groupBy, sortBy]
      ```
    - Note that if `manualPagination` is set to `true`, then the pageIndex should not be reset when `rows` change
  - If set, the dependencies returned from this function will be used to determine when the effect to reset the `pageIndex` state is fired.
  - To disable, set to `false`
  - For more information see the FAQ ["How do I stop my table state from automatically resetting when my data changes?"](./faq#how-do-i-stop-my-table-state-from-automatically-resetting-when-my-data-changes)
- `paginateExpandedRows: Bool`
  - Optional
  - Only applies when using the `useExpanded` plugin hook simultaneously
  - Defaults to `true`
  - If set to `true`, expanded rows are paginated along with normal rows. This results in stable page sizes across every page.
  - If set to `false`, expanded rows will be spliced in after pagination. This means that the total number of rows in a page can potentially be larger than the page size, depending on how many subrows are expanded.

### Instance Properties

The following values are provided to the table `instance`:

- `page: Array<row>`
  - An array of rows for the **current** page, determined by the current `pageIndex` value.
- `pageCount: Int`
  - If `manualPagination` is set to `false`, this is the total amount of pages available in the table based on the current `pageSize` value
  - if `manualPagination` is set to `true`, this is merely the same `pageCount` option that was passed in the table options.
- `pageOptions: Array<Int>`
  - An array of zero-based index integers corresponding to available pages in the table.
  - This can be useful for generating things like select interfaces for the user to select a page from a list, instead of manually paginating to the desired page.
- `canPreviousPage: Bool`
  - If there are pages and the current `pageIndex` is greater than `0`, this will be `true`
- `canNextPage:`
  - If there are pages and the current `pageIndex` is less than `pageCount`, this will be `true`
- `gotoPage: Function(pageIndex)`
  - This function, when called with a valid `pageIndex`, will set `pageIndex` to that value.
  - If the aginateassed index is outside of the valid `pageIndex` range, then this function will do nothing.
- `previousPage: Function`
  - This function decreases `state.pageIndex` by one.
  - If there are no pages or `canPreviousPage` is false, this function will do nothing.
- `nextPage: Function`
  - This function increases `state.pageIndex` by one.
  - If there are no pages or `canNextPage` is false, this function will do nothing.
- `setPageSize: Function(pageSize)`
  - This function sets `state.pageSize` to the new value.
  - As a result of a pageSize change, a new `state.pageIndex` is also calculated. It is calculated via `Math.floor(currentTopRowIndex / newPageSize)`
- `pageIndex: Int`
  - This is the resolved `state.pageIndex` value.
- `pageSize: Int`
  - This is the resolved `state.pageSize` value.

### Example

- Basic Pagination
  - [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/pagination)
  - [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/pagination)
- Controlled Pagination
  - [Source](https://github.com/tannerlinsley/react-table/tree/master/examples/pagination)
  - [Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/pagination)
