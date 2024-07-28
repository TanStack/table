---
id: Table_RowPagination
title: Table_RowPagination
---

# Interface: Table\_RowPagination\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_autoResetPageIndex()

```ts
_autoResetPageIndex: () => void;
```

#### Returns

`void`

#### Defined in

[features/row-pagination/RowPagination.types.ts:55](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L55)

***

### firstPage()

```ts
firstPage: () => void;
```

Sets the page index to `0`.

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#firstpage)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:115](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L115)

***

### getCanNextPage()

```ts
getCanNextPage: () => boolean;
```

Returns whether the table can go to the next page.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getcannextpage)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:61](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L61)

***

### getCanPreviousPage()

```ts
getCanPreviousPage: () => boolean;
```

Returns whether the table can go to the previous page.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getcanpreviouspage)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:67](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L67)

***

### getPageCount()

```ts
getPageCount: () => number;
```

Returns the page count. If manually paginating or controlling the pagination state, this will come directly from the `options.pageCount` table option, otherwise it will be calculated from the table data using the total row count and current page size.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getpagecount)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:73](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L73)

***

### getPageOptions()

```ts
getPageOptions: () => number[];
```

Returns an array of page options (zero-index-based) for the current page size.

#### Returns

`number`[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getpageoptions)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:85](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L85)

***

### getPaginatedRowModel()

```ts
getPaginatedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table after pagination has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getPaginatedRowModel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:91](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L91)

***

### getPrePaginationRowModel()

```ts
getPrePaginationRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table before any pagination has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getprepaginationrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:97](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L97)

***

### getRowCount()

```ts
getRowCount: () => number;
```

Returns the row count. If manually paginating or controlling the pagination state, this will come directly from the `options.rowCount` table option, otherwise it will be calculated from the table data.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getrowcount)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:79](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L79)

***

### lastPage()

```ts
lastPage: () => void;
```

Sets the page index to the last page.

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#lastpage)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:121](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L121)

***

### nextPage()

```ts
nextPage: () => void;
```

Increments the page index by one, if possible.

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#nextpage)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:103](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L103)

***

### previousPage()

```ts
previousPage: () => void;
```

Decrements the page index by one, if possible.

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#previouspage)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:109](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L109)

***

### resetPageIndex()

```ts
resetPageIndex: (defaultState?) => void;
```

Resets the page index to its initial state. If `defaultState` is `true`, the page index will be reset to `0` regardless of initial state.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#resetpageindex)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:127](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L127)

***

### resetPageSize()

```ts
resetPageSize: (defaultState?) => void;
```

Resets the page size to its initial state. If `defaultState` is `true`, the page size will be reset to `10` regardless of initial state.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#resetpagesize)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:133](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L133)

***

### resetPagination()

```ts
resetPagination: (defaultState?) => void;
```

Resets the **pagination** state to `initialState.pagination`, or `true` can be passed to force a default blank state reset to `[]`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#resetpagination)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:139](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L139)

***

### setPageIndex()

```ts
setPageIndex: (updater) => void;
```

Updates the page index using the provided function or value in the `state.pagination.pageIndex` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<`number`\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#setpageindex)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:145](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L145)

***

### setPageSize()

```ts
setPageSize: (updater) => void;
```

Updates the page size using the provided function or value in the `state.pagination.pageSize` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<`number`\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#setpagesize)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:151](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L151)

***

### setPagination()

```ts
setPagination: (updater) => void;
```

Sets or updates the `state.pagination` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`PaginationState`](paginationstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#setpagination)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:157](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L157)
