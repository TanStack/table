---
id: ColumnDef_RowSorting
title: ColumnDef_RowSorting
---

# Interface: ColumnDef\_RowSorting\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### enableMultiSort?

```ts
optional enableMultiSort: boolean;
```

Enables/Disables multi-sorting for this column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultisort)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:52](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L52)

***

### enableSorting?

```ts
optional enableSorting: boolean;
```

Enables/Disables sorting for this column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:58](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L58)

***

### invertSorting?

```ts
optional invertSorting: boolean;
```

Inverts the order of the sorting for this column. This is useful for values that have an inverted best/worst scale where lower numbers are better, eg. a ranking (1st, 2nd, 3rd) or golf-like scoring

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#invertsorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:64](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L64)

***

### sortDescFirst?

```ts
optional sortDescFirst: boolean;
```

Set to `true` for sorting toggles on this column to start in the descending direction.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortdescfirst)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:70](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L70)

***

### sortUndefined?

```ts
optional sortUndefined: 
  | false
  | 1
  | -1
  | "first"
  | "last";
```

The priority of undefined values when sorting this column.
- `false`
  - Undefined values will be considered tied and need to be sorted by the next column filter or original index (whichever applies)
- `-1`
  - Undefined values will be sorted with higher priority (ascending) (if ascending, undefined will appear on the beginning of the list)
- `1`
  - Undefined values will be sorted with lower priority (descending) (if ascending, undefined will appear on the end of the list)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortundefined)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:90](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L90)

***

### sortingFn?

```ts
optional sortingFn: SortingFnOption<TFeatures, TData>;
```

The sorting function to use with this column.
- A `string` referencing a built-in sorting function
- A custom sorting function

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortingfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:78](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L78)
