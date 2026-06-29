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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L83)

Sets the page index to `0`.

#### Returns

`void`

***

### getCanNextPage()

```ts
getCanNextPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L52)

Checks whether the current page index can move forward.

#### Returns

`boolean`

***

### getCanPreviousPage()

```ts
getCanPreviousPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L56)

Checks whether the current page index can move backward.

#### Returns

`boolean`

***

### getPageCount()

```ts
getPageCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L61)

Resolves the current page count from `options.pageCount` or row count and
page size.

#### Returns

`number`

***

### getPageOptions()

```ts
getPageOptions: () => number[];
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L71)

Builds zero-based page indexes for the current page count.

#### Returns

`number`[]

***

### getRowCount()

```ts
getRowCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L67)

Resolves the row count used for pagination math.

`options.rowCount` wins; otherwise the pre-paginated row model is counted.

#### Returns

`number`

***

### lastPage()

```ts
lastPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L87)

Sets the page index to the last page.

#### Returns

`void`

***

### nextPage()

```ts
nextPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L75)

Increments the page index by one, if possible.

#### Returns

`void`

***

### previousPage()

```ts
previousPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L79)

Decrements the page index by one, if possible.

#### Returns

`void`

***

### resetPageIndex()

```ts
resetPageIndex: (defaultState?) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L92)

Resets `pagination.pageIndex` to initial state, or to `0` when
`defaultState` is `true`.

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L97)

Resets `pagination.pageSize` to initial state, or to `10` when
`defaultState` is `true`.

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L104)

Resets `pagination` to `initialState.pagination`.

Pass `true` to ignore initial state and reset to
`{ pageIndex: 0, pageSize: 10 }`.

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L108)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L112)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L116)

Updates pagination state with a next state or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`PaginationState`](PaginationState.md)\>

#### Returns

`void`
