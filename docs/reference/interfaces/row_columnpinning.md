---
id: Row_ColumnPinning
title: Row_ColumnPinning
---

# Interface: Row\_ColumnPinning\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getCenterVisibleCells()

```ts
getCenterVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Returns all center pinned (unpinned) leaf cells in the row.

#### Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getcentervisiblecells)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:90](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L90)

***

### getLeftVisibleCells()

```ts
getLeftVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Returns all left pinned leaf cells in the row.

#### Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getleftvisiblecells)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:96](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L96)

***

### getRightVisibleCells()

```ts
getRightVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Returns all right pinned leaf cells in the row.

#### Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getrightvisiblecells)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:102](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L102)
