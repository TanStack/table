---
id: Table_Rows
title: Table_Rows
---

# Interface: Table\_Rows\<TFeatures, TData\>

Defined in: [core/rows/coreRowsFeature.types.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L130)

## Extended by

- [`Table_Core`](Table_Core.md)
- [`Table_Internal`](Table_Internal.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getMaxSubRowDepth()

```ts
getMaxSubRowDepth: () => number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L138)

Returns the deepest structural row depth in the core row model.
Root rows are depth `0`, direct sub-rows are depth `1`, and so on.

#### Returns

`number`

***

### getRow()

```ts
getRow: (id, searchAll?) => Row<TFeatures, TData>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:153](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L153)

Returns the row with the given ID.

#### Parameters

##### id

`string`

##### searchAll?

`boolean`

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

***

### getRowId()

```ts
getRowId: (_, index, parent?) => string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L149)

Returns the row id for a given row.

#### Parameters

##### \_

`TData`

##### index

`number`

##### parent?

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`string`

***

### getRowsInDisplayOrder()

```ts
getRowsInDisplayOrder: () => Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:145](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L145)

Returns the rows in the current display order and assigns their display
indexes. When expanded rows bypass pagination, expanded descendants are
included in this order. This is the memoized source for
`row.getDisplayIndex()`.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]
