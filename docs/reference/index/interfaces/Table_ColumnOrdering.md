---
id: Table_ColumnOrdering
title: Table_ColumnOrdering
---

# Interface: Table\_ColumnOrdering\<TFeatures, TData\>

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L46)

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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L55)

Resets `columnOrder` to `initialState.columnOrder`.

Pass `true` to ignore initial state and reset to `[]`.

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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L59)

Updates column order state with a next ordered id array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnOrderState`](../type-aliases/ColumnOrderState.md)\>

#### Returns

`void`
