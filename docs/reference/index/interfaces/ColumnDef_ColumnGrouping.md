---
id: ColumnDef_ColumnGrouping
title: ColumnDef_ColumnGrouping
---

# Interface: ColumnDef\_ColumnGrouping\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L12)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### enableGrouping?

```ts
optional enableGrouping: boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L21)

Allows this column to be added to grouping state.

Defaults to `true`; table-level `enableGrouping` must also allow grouping.

***

### getGroupingValue()?

```ts
optional getGroupingValue: (originalRow, index, row) => any;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L28)

Returns the value used to group rows for this column.

When omitted, grouping uses the value derived from this column's
`accessorKey` or `accessorFn`.

#### Parameters

##### originalRow

`TData`

##### index

`number`

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`any`
