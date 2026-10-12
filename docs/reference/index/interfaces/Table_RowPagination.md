---
id: Table_RowPagination
title: Table_RowPagination
---

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L47)

## Type Parameters

### _TFeatures

`_TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### _TData

`_TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### autoResetPageIndex

```ts
autoResetPageIndex: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L58)

Resets the page index to `0` after page-altering changes such as new
data, filtering, sorting, or grouping.

Honors `autoResetAll`, `autoResetPageIndex`, and `manualPagination`.
Called by the row models; you rarely need to invoke it yourself.

#### Returns

`void`

***

### firstPage

```ts
firstPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L97)

Sets the page index to `0`.

#### Returns

`void`

***

### getCanLastPage

```ts
getCanLastPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L66)

Checks whether a known, finite last page exists after the current page.

#### Returns

`boolean`

***

### getCanNextPage

```ts
getCanNextPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L62)

Checks whether the current page index can move forward.

#### Returns

`boolean`

***

### getCanPreviousPage

```ts
getCanPreviousPage: () => boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L70)

Checks whether the current page index can move backward.

#### Returns

`boolean`

***

### getPageCount

```ts
getPageCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L75)

Resolves the current page count from `options.pageCount` or row count and
page size.

#### Returns

`number`

***

### getPageOptions

```ts
getPageOptions: () => number[];
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L85)

Builds zero-based page indexes for the current page count.

#### Returns

`number`[]

***

### getRowCount

```ts
getRowCount: () => number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L81)

Resolves the row count used for pagination math.

`options.rowCount` wins; otherwise the pre-paginated row model is counted.

#### Returns

`number`

***

### lastPage

```ts
lastPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L102)

Sets the page index to the last known page. Does nothing when the page
count is unknown, empty, or non-finite.

#### Returns

`void`

***

### nextPage

```ts
nextPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L89)

Increments the page index by one, if possible.

#### Returns

`void`

***

### previousPage

```ts
previousPage: () => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L93)

Decrements the page index by one, if possible.

#### Returns

`void`

***

### resetPageIndex

```ts
resetPageIndex: (defaultState?) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L107)

Resets `pagination.pageIndex` to initial state, or to `0` when
`defaultState` is `true`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### resetPageSize

```ts
resetPageSize: (defaultState?) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L112)

Resets `pagination.pageSize` to initial state, or to `10` when
`defaultState` is `true`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### resetPagination

```ts
resetPagination: (defaultState?) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L119)

Resets `pagination` to `initialState.pagination`.

Pass `true` to ignore initial state and reset to
`{ pageIndex: 0, pageSize: 10 }`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setPageIndex

```ts
setPageIndex: (updater) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L123)

Updates `pagination.pageIndex` using a value or updater.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<`number`\>

#### Returns

`void`

***

### setPageSize

```ts
setPageSize: (updater) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L127)

Updates `pagination.pageSize` using a value or updater.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<`number`\>

#### Returns

`void`

***

### setPagination

```ts
setPagination: (updater) => void;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L131)

Updates pagination state with a next state or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`PaginationState`](PaginationState.md)\>

#### Returns

`void`
