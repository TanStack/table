---
id: TableOptions_RowPagination
title: TableOptions_RowPagination
---

# Interface: TableOptions\_RowPagination

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L15)

## Properties

### autoResetPageIndex?

```ts
optional autoResetPageIndex: boolean;
```

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L19)

If set to `true`, pagination will be reset to the first page when page-altering state changes eg. `data` is updated, filters change, grouping changes, etc.

***

### manualPagination?

```ts
optional manualPagination: boolean;
```

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L23)

Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginatedRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.

***

### onPaginationChange?

```ts
optional onPaginationChange: OnChangeFn<PaginationState>;
```

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L27)

If this function is provided, it will be called when the pagination state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.pagination` option.

***

### pageCount?

```ts
optional pageCount: number;
```

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L31)

When manually controlling pagination, you can supply a total `pageCount` value to the table if you know it (Or supply a `rowCount` and `pageCount` will be calculated). If you do not know how many pages there are, you can set this to `-1`.

***

### rowCount?

```ts
optional rowCount: number;
```

Defined in: [packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L35)

When manually controlling pagination, you can supply a total `rowCount` value to the table if you know it. The `pageCount` can be calculated from this value and the `pageSize`.
