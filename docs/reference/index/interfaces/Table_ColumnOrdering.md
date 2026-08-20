---
id: Table_ColumnOrdering
title: Table_ColumnOrdering
---

# Interface: Table\_ColumnOrdering\<_TFeatures, _TData\>

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L65)

## Type Parameters

### _TFeatures

`_TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### _TData

`_TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getColumnIndexes()

```ts
getColumnIndexes: () => ColumnIndexes;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L75)

Builds column-id to index records for each visible pinning region.

This is the memoized source that `column.getIndex` reads from; most apps
will not need to call it directly.

#### Returns

[`ColumnIndexes`](ColumnIndexes.md)

***

### resetColumnOrder()

```ts
resetColumnOrder: (defaultState?) => void;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L81)

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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L85)

Updates column order state with a next ordered id array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnOrderState`](../type-aliases/ColumnOrderState.md)\>

#### Returns

`void`
