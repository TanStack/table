---
id: Row_ColumnVisibility
title: Row_ColumnVisibility
---

# Interface: Row\_ColumnVisibility\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_getAllVisibleCells()

```ts
_getAllVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

#### Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:94](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L94)

***

### getVisibleCells()

```ts
getVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Returns an array of cells that account for column visibility for the row.

#### Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getvisiblecells)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:100](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L100)
