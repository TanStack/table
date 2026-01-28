---
id: Table_ColumnOrdering
title: Table_ColumnOrdering
---

# Interface: Table\_ColumnOrdering\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L37)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### resetColumnOrder()

```ts
resetColumnOrder: (defaultState?) => void;
```

Defined in: [packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L44)

Resets the **columnOrder** state to `initialState.columnOrder`, or `true` can be passed to force a default blank state reset to `[]`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setColumnOrder()

```ts
setColumnOrder: (updater) => void;
```

Defined in: [packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L48)

Sets or updates the `state.columnOrder` state.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnOrderState`](../type-aliases/ColumnOrderState.md)\>

#### Returns

`void`
