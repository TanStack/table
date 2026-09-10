---
id: Table_RowPagination
title: Table_RowPagination
---

# Interface: Table\_RowPagination\<_TFeatures, _TData\>

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L47)

## Type Parameters

### _TFeatures

`_TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### _TData

`_TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_autoResetPageIndex()

```ts
_autoResetPageIndex: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L51)

#### Returns

`void`

***

### firstPage()

```ts
firstPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L90)

Sets the page index to `0`.

#### Returns

`void`

***

### getCanLastPage()

```ts
getCanLastPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L59)

Checks whether a known, finite last page exists after the current page.

#### Returns

`boolean`

***

### getCanNextPage()

```ts
getCanNextPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L55)

Checks whether the current page index can move forward.

#### Returns

`boolean`

***

### getCanPreviousPage()

```ts
getCanPreviousPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L63)

Checks whether the current page index can move backward.

#### Returns

`boolean`

***

### getPageCount()

```ts
getPageCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L68)

Resolves the current page count from `options.pageCount` or row count and
page size.

#### Returns

`number`

***

### getPageOptions()

```ts
getPageOptions: () => number[];
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L78)

Builds zero-based page indexes for the current page count.

#### Returns

`number`[]

***

### getRowCount()

```ts
getRowCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L74)

Resolves the row count used for pagination math.

`options.rowCount` wins; otherwise the pre-paginated row model is counted.

#### Returns

`number`

***

### lastPage()

```ts
lastPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L95)

Sets the page index to the last known page. Does nothing when the page
count is unknown, empty, or non-finite.

#### Returns

`void`

***

### nextPage()

```ts
nextPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L82)

Increments the page index by one, if possible.

#### Returns

`void`

***

### previousPage()

```ts
previousPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L86)

Decrements the page index by one, if possible.

#### Returns

`void`

***

### resetPageIndex()

```ts
resetPageIndex: (defaultState?) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L100)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L105)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L112)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L116)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L120)

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

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L124)

Updates pagination state with a next state or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`PaginationState`](PaginationState.md)\>

#### Returns

`void`
