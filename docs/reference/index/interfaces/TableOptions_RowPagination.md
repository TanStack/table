---
id: TableOptions_RowPagination
title: TableOptions_RowPagination
---

# Interface: TableOptions\_RowPagination

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L14)

## Properties

### autoResetPageIndex?

```ts
optional autoResetPageIndex: boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L18)

If set to `true`, pagination will be reset to the first page when page-altering state changes e.g. `data` is updated, filters change, grouping changes, etc.

***

### manualPagination?

```ts
optional manualPagination: boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L22)

Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginatedRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.

***

### onPaginationChange?

```ts
optional onPaginationChange: OnChangeFn<PaginationState>;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L28)

Called with an updater when pagination state changes. Pair this with
`state.pagination` when using external state; external atoms can own the
slice without this callback.

***

### pageCount?

```ts
optional pageCount: number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L32)

When manually controlling pagination, you can supply a total `pageCount` value to the table if you know it (Or supply a `rowCount` and `pageCount` will be calculated). If you do not know how many pages there are, you can set this to `-1`.

***

### rowCount?

```ts
optional rowCount: number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L36)

When manually controlling pagination, you can supply a total `rowCount` value to the table if you know it. The `pageCount` can be calculated from this value and the `pageSize`.
