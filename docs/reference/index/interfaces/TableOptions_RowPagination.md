---
id: TableOptions_RowPagination
title: TableOptions_RowPagination
---

# Interface: TableOptions\_RowPagination

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L15)

## Properties

### autoResetPageIndex?

```ts
optional autoResetPageIndex: boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L19)

If set to `true`, pagination will be reset to the first page when page-altering state changes eg. `data` is updated, filters change, grouping changes, etc.

***

### manualPagination?

```ts
optional manualPagination: boolean;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L23)

Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginatedRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.

***

### onPaginationChange?

```ts
optional onPaginationChange: OnChangeFn<PaginationState>;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L29)

Called with an updater when pagination state changes. Pair this with
`state.pagination` when using external state; external atoms can own the
slice without this callback.

***

### pageCount?

```ts
optional pageCount: number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L33)

When manually controlling pagination, you can supply a total `pageCount` value to the table if you know it (Or supply a `rowCount` and `pageCount` will be calculated). If you do not know how many pages there are, you can set this to `-1`.

***

### rowCount?

```ts
optional rowCount: number;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L37)

When manually controlling pagination, you can supply a total `rowCount` value to the table if you know it. The `pageCount` can be calculated from this value and the `pageSize`.
