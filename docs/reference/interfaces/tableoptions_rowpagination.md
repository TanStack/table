---
id: TableOptions_RowPagination
title: TableOptions_RowPagination
---

# Interface: TableOptions\_RowPagination

## Properties

### autoResetPageIndex?

```ts
optional autoResetPageIndex: boolean;
```

If set to `true`, pagination will be reset to the first page when page-altering state changes eg. `data` is updated, filters change, grouping changes, etc.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#autoresetpageindex)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:20](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L20)

***

### manualPagination?

```ts
optional manualPagination: boolean;
```

Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginatedRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#manualpagination)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:26](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L26)

***

### onPaginationChange?

```ts
optional onPaginationChange: OnChangeFn<PaginationState>;
```

If this function is provided, it will be called when the pagination state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.pagination` option.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#onpaginationchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:32](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L32)

***

### pageCount?

```ts
optional pageCount: number;
```

When manually controlling pagination, you can supply a total `pageCount` value to the table if you know it (Or supply a `rowCount` and `pageCount` will be calculated). If you do not know how many pages there are, you can set this to `-1`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#pagecount)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:38](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L38)

***

### rowCount?

```ts
optional rowCount: number;
```

When manually controlling pagination, you can supply a total `rowCount` value to the table if you know it. The `pageCount` can be calculated from this value and the `pageSize`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#rowcount)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/pagination)

#### Defined in

[features/row-pagination/RowPagination.types.ts:44](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pagination/RowPagination.types.ts#L44)
