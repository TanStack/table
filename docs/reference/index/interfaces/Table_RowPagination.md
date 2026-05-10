---
id: Table_RowPagination
title: Table_RowPagination
---

# Interface: Table\_RowPagination\<TFeatures, TData\>

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L44)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L48)

#### Returns

`void`

***

### firstPage()

```ts
firstPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L80)

Sets the page index to `0`.

#### Returns

`void`

***

### getCanNextPage()

```ts
getCanNextPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L52)

Returns whether the table can go to the next page.

#### Returns

`boolean`

***

### getCanPreviousPage()

```ts
getCanPreviousPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L56)

Returns whether the table can go to the previous page.

#### Returns

`boolean`

***

### getPageCount()

```ts
getPageCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L60)

Returns the page count. If manually paginating or controlling the pagination state, this will come directly from the `options.pageCount` table option, otherwise it will be calculated from the table data using the total row count and current page size.

#### Returns

`number`

***

### getPageOptions()

```ts
getPageOptions: () => number[];
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L68)

Returns an array of page options (zero-index-based) for the current page size.

#### Returns

`number`[]

***

### getRowCount()

```ts
getRowCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L64)

Returns the row count. If manually paginating or controlling the pagination state, this will come directly from the `options.rowCount` table option, otherwise it will be calculated from the table data.

#### Returns

`number`

***

### lastPage()

```ts
lastPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L84)

Sets the page index to the last page.

#### Returns

`void`

***

### nextPage()

```ts
nextPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L72)

Increments the page index by one, if possible.

#### Returns

`void`

***

### previousPage()

```ts
previousPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L76)

Decrements the page index by one, if possible.

#### Returns

`void`

***

### resetPageIndex()

```ts
resetPageIndex: (defaultState?) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L88)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L92)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L97)

Resets pagination state to `initialState.pagination`. Pass `true` to reset
to the feature default of `{ pageIndex: 0, pageSize: 10 }`.

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L101)

Updates `pagination.pageIndex` using a value or updater.

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L105)

Updates `pagination.pageSize` using a value or updater.

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L109)

Sets pagination state using a value or updater.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`PaginationState`](PaginationState.md)\>

#### Returns

`void`
