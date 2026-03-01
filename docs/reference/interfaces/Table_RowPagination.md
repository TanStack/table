---
id: Table_RowPagination
title: Table_RowPagination
---

# Interface: Table\_RowPagination\<TFeatures, TData\>

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L42)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_autoResetPageIndex()

```ts
_autoResetPageIndex: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L46)

#### Returns

`void`

***

### firstPage()

```ts
firstPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L78)

Sets the page index to `0`.

#### Returns

`void`

***

### getCanNextPage()

```ts
getCanNextPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L50)

Returns whether the table can go to the next page.

#### Returns

`boolean`

***

### getCanPreviousPage()

```ts
getCanPreviousPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L54)

Returns whether the table can go to the previous page.

#### Returns

`boolean`

***

### getPageCount()

```ts
getPageCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L58)

Returns the page count. If manually paginating or controlling the pagination state, this will come directly from the `options.pageCount` table option, otherwise it will be calculated from the table data using the total row count and current page size.

#### Returns

`number`

***

### getPageOptions()

```ts
getPageOptions: () => number[];
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L66)

Returns an array of page options (zero-index-based) for the current page size.

#### Returns

`number`[]

***

### getRowCount()

```ts
getRowCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L62)

Returns the row count. If manually paginating or controlling the pagination state, this will come directly from the `options.rowCount` table option, otherwise it will be calculated from the table data.

#### Returns

`number`

***

### lastPage()

```ts
lastPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L82)

Sets the page index to the last page.

#### Returns

`void`

***

### nextPage()

```ts
nextPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L70)

Increments the page index by one, if possible.

#### Returns

`void`

***

### previousPage()

```ts
previousPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L74)

Decrements the page index by one, if possible.

#### Returns

`void`

***

### resetPageIndex()

```ts
resetPageIndex: (defaultState?) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L86)

Resets the page index to its initial state. If `defaultState` is `true`, the page index will be reset to `0` regardless of initial state.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### resetPageSize()

```ts
resetPageSize: (defaultState?) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L90)

Resets the page size to its initial state. If `defaultState` is `true`, the page size will be reset to `10` regardless of initial state.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### resetPagination()

```ts
resetPagination: (defaultState?) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L94)

Resets the **pagination** state to `initialState.pagination`, or `true` can be passed to force a default blank state reset to `[]`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setPageIndex()

```ts
setPageIndex: (updater) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L98)

Updates the page index using the provided function or value in the `state.pagination.pageIndex` state.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<`number`\>

#### Returns

`void`

***

### setPageSize()

```ts
setPageSize: (updater) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L102)

Updates the page size using the provided function or value in the `state.pagination.pageSize` state.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<`number`\>

#### Returns

`void`

***

### setPagination()

```ts
setPagination: (updater) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L106)

Sets or updates the `state.pagination` state.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`PaginationState`](PaginationState.md)\>

#### Returns

`void`
