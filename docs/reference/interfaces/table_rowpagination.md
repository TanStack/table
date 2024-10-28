---
id: Table_RowPagination
title: Table_RowPagination
---

# Interface: Table\_RowPagination\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_autoResetPageIndex()

```ts
_autoResetPageIndex: () => void;
```

#### Returns

`void`

#### Defined in

[features/row-pagination/RowPagination.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L56)

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

[features/row-pagination/RowPagination.types.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L104)

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

[features/row-pagination/RowPagination.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L62)

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

[features/row-pagination/RowPagination.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L68)

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

[features/row-pagination/RowPagination.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L74)

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

[features/row-pagination/RowPagination.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L86)

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

[features/row-pagination/RowPagination.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L80)

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

[features/row-pagination/RowPagination.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L110)

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

[features/row-pagination/RowPagination.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L92)

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

[features/row-pagination/RowPagination.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L98)

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

[features/row-pagination/RowPagination.types.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L116)

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

[features/row-pagination/RowPagination.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L122)

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

[features/row-pagination/RowPagination.types.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L128)

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

[features/row-pagination/RowPagination.types.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L134)

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

[features/row-pagination/RowPagination.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L140)

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

[features/row-pagination/RowPagination.types.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L146)
