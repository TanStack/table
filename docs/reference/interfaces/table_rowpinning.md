---
id: Table_RowPinning
title: Table_RowPinning
---

# Interface: Table\_RowPinning\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getBottomRows()

```ts
getBottomRows: () => Row<TFeatures, TData>[];
```

Returns all bottom pinned rows.

#### Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getbottomrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:84](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L84)

***

### getCenterRows()

```ts
getCenterRows: () => Row<TFeatures, TData>[];
```

Returns all rows that are not pinned to the top or bottom.

#### Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getcenterrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:90](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L90)

***

### getIsSomeRowsPinned()

```ts
getIsSomeRowsPinned: (position?) => boolean;
```

Returns whether or not any rows are pinned. Optionally specify to only check for pinned rows in either the `top` or `bottom` position.

#### Parameters

• **position?**: [`RowPinningPosition`](../type-aliases/rowpinningposition.md)

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getissomerowspinned)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:96](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L96)

***

### getTopRows()

```ts
getTopRows: () => Row<TFeatures, TData>[];
```

Returns all top pinned rows.

#### Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#gettoprows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:102](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L102)

***

### resetRowPinning()

```ts
resetRowPinning: (defaultState?) => void;
```

Resets the **rowPinning** state to `initialState.rowPinning`, or `true` can be passed to force a default blank state reset to `{ top: [], bottom: [], }`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#resetrowpinning)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:108](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L108)

***

### setRowPinning()

```ts
setRowPinning: (updater) => void;
```

Sets or updates the `state.rowPinning` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`RowPinningState`](rowpinningstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#setrowpinning)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:114](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L114)
