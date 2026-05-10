---
id: ColumnDef_RowSorting
title: ColumnDef_RowSorting
---

# Interface: ColumnDef\_RowSorting\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L51)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### enableMultiSort?

```ts
optional enableMultiSort: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L58)

Enables/Disables multi-sorting for this column.

***

### enableSorting?

```ts
optional enableSorting: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L62)

Enables/Disables sorting for this column.

***

### invertSorting?

```ts
optional invertSorting: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L66)

Inverts the order of the sorting for this column. This is useful for values that have an inverted best/worst scale where lower numbers are better, eg. a ranking (1st, 2nd, 3rd) or golf-like scoring

***

### sortDescFirst?

```ts
optional sortDescFirst: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L70)

Set to `true` for sorting toggles on this column to start in the descending direction.

***

### sortFn?

```ts
optional sortFn: SortFnOption<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L76)

The sorting function to use with this column.
- A `string` referencing a built-in sorting function
- A custom sorting function

***

### sortUndefined?

```ts
optional sortUndefined: false | 1 | -1 | "first" | "last";
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L86)

The priority of undefined values when sorting this column.
- `false`
  - Undefined values will be considered tied and need to be sorted by the next column filter or original index (whichever applies)
- `-1`
  - Undefined values will be sorted with higher priority (ascending) (if ascending, undefined will appear on the beginning of the list)
- `1`
  - Undefined values will be sorted with lower priority (descending) (if ascending, undefined will appear on the end of the list)
