---
id: Table_ColumnOrdering
title: Table_ColumnOrdering
---

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L66)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getColumnIndexes

```ts
getColumnIndexes: () => ColumnIndexes;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L76)

Builds column-id to index records for each visible pinning region.

This is the memoized source that `column.getIndex` reads from; most apps
will not need to call it directly.

#### Returns

[`ColumnIndexes`](ColumnIndexes.md)

***

### getOrderColumnsFn

```ts
getOrderColumnsFn: () => (columns) => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L83)

Returns a function that orders leaf columns by `columnOrder`, after moving
grouped columns as `groupedColumnMode` sets.

Leaf column order reads it; most apps will not need to call it directly.

#### Returns

(`columns`) => [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### resetColumnOrder

```ts
resetColumnOrder: (defaultState?) => void;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L91)

Resets `columnOrder` to `initialState.columnOrder`.

Pass `true` to ignore initial state and reset to `[]`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setColumnOrder

```ts
setColumnOrder: (updater) => void;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L95)

Updates column order state with a next ordered id array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnOrderState`](../type-aliases/ColumnOrderState.md)\>

#### Returns

`void`
