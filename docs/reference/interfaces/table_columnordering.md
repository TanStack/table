---
id: Table_ColumnOrdering
title: Table_ColumnOrdering
---

# Interface: Table\_ColumnOrdering\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### resetColumnOrder()

```ts
resetColumnOrder: (defaultState?) => void;
```

Resets the **columnOrder** state to `initialState.columnOrder`, or `true` can be passed to force a default blank state reset to `[]`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#resetcolumnorder)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)

#### Defined in

[features/column-ordering/ColumnOrdering.types.ts:55](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-ordering/ColumnOrdering.types.ts#L55)

***

### setColumnOrder()

```ts
setColumnOrder: (updater) => void;
```

Sets or updates the `state.columnOrder` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnOrderState`](../type-aliases/columnorderstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#setcolumnorder)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)

#### Defined in

[features/column-ordering/ColumnOrdering.types.ts:61](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-ordering/ColumnOrdering.types.ts#L61)
