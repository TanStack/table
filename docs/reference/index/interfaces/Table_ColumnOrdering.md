---
id: Table_ColumnOrdering
title: Table_ColumnOrdering
---

# Interface: Table\_ColumnOrdering\<TFeatures, TData\>

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L39)

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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L46)

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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L50)

Sets column order state using a value or updater.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnOrderState`](../type-aliases/ColumnOrderState.md)\>

#### Returns

`void`
