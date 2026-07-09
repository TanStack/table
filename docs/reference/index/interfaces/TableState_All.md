---
id: TableState_All
title: TableState_All
---

# Interface: TableState\_All

Defined in: [types/TableState.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableState.ts#L47)

Internal broad state shape containing every registered feature state slice.

Feature internals use this when they may need to inspect optional slices owned
by other features.

## Extends

- `Partial`\<[`TableState_ColumnFiltering`](TableState_ColumnFiltering.md) & [`TableState_ColumnGrouping`](TableState_ColumnGrouping.md) & [`TableState_ColumnOrdering`](TableState_ColumnOrdering.md) & [`TableState_ColumnPinning`](TableState_ColumnPinning.md) & [`TableState_ColumnResizing`](TableState_ColumnResizing.md) & [`TableState_ColumnSizing`](TableState_ColumnSizing.md) & [`TableState_ColumnVisibility`](TableState_ColumnVisibility.md) & [`TableState_GlobalFiltering`](TableState_GlobalFiltering.md) & [`TableState_RowExpanding`](TableState_RowExpanding.md) & [`TableState_RowPagination`](TableState_RowPagination.md) & [`TableState_RowPinning`](TableState_RowPinning.md) & [`TableState_RowSelection`](TableState_RowSelection.md) & [`TableState_RowSorting`](TableState_RowSorting.md)\>

## Properties

### columnFilters?

```ts
optional columnFilters: ColumnFiltersState;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L33)

#### Inherited from

[`TableState_ColumnFiltering`](TableState_ColumnFiltering.md).[`columnFilters`](TableState_ColumnFiltering.md#columnfilters)

***

### columnOrder?

```ts
optional columnOrder: ColumnOrderState;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L27)

#### Inherited from

[`TableState_ColumnOrdering`](TableState_ColumnOrdering.md).[`columnOrder`](TableState_ColumnOrdering.md#columnorder)

***

### columnPinning?

```ts
optional columnPinning: ColumnPinningState;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L16)

#### Inherited from

[`TableState_ColumnPinning`](TableState_ColumnPinning.md).[`columnPinning`](TableState_ColumnPinning.md#columnpinning)

***

### columnResizing?

```ts
optional columnResizing: columnResizingState;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:4](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L4)

#### Inherited from

[`TableState_ColumnResizing`](TableState_ColumnResizing.md).[`columnResizing`](TableState_ColumnResizing.md#columnresizing)

***

### columnSizing?

```ts
optional columnSizing: ColumnSizingState;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:5](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L5)

#### Inherited from

[`TableState_ColumnSizing`](TableState_ColumnSizing.md).[`columnSizing`](TableState_ColumnSizing.md#columnsizing)

***

### columnVisibility?

```ts
optional columnVisibility: ColumnVisibilityState;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:9](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L9)

#### Inherited from

[`TableState_ColumnVisibility`](TableState_ColumnVisibility.md).[`columnVisibility`](TableState_ColumnVisibility.md#columnvisibility)

***

### expanded?

```ts
optional expanded: ExpandedState;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L10)

#### Inherited from

[`TableState_RowExpanding`](TableState_RowExpanding.md).[`expanded`](TableState_RowExpanding.md#expanded)

***

### globalFilter?

```ts
optional globalFilter: any;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L15)

#### Inherited from

[`TableState_GlobalFiltering`](TableState_GlobalFiltering.md).[`globalFilter`](TableState_GlobalFiltering.md#globalfilter)

***

### grouping?

```ts
optional grouping: GroupingState;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L17)

#### Inherited from

[`TableState_ColumnGrouping`](TableState_ColumnGrouping.md).[`grouping`](TableState_ColumnGrouping.md#grouping)

***

### pagination?

```ts
optional pagination: PaginationState;
```

Defined in: [features/row-pagination/rowPaginationFeature.types.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts#L11)

#### Inherited from

[`TableState_RowPagination`](TableState_RowPagination.md).[`pagination`](TableState_RowPagination.md#pagination)

***

### rowPinning?

```ts
optional rowPinning: RowPinningState;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L13)

#### Inherited from

[`TableState_RowPinning`](TableState_RowPinning.md).[`rowPinning`](TableState_RowPinning.md#rowpinning)

***

### rowSelection?

```ts
optional rowSelection: RowSelectionState;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:9](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L9)

#### Inherited from

[`TableState_RowSelection`](TableState_RowSelection.md).[`rowSelection`](TableState_RowSelection.md#rowselection)

***

### sorting?

```ts
optional sorting: SortingState;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L17)

#### Inherited from

[`TableState_RowSorting`](TableState_RowSorting.md).[`sorting`](TableState_RowSorting.md#sorting)
