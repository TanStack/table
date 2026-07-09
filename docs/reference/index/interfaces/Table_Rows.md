---
id: Table_Rows
title: Table_Rows
---

# Interface: Table\_Rows\<TFeatures, TData\>

Defined in: [core/rows/coreRowsFeature.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L113)

## Extended by

- [`Table_Core`](Table_Core.md)
- [`Table_Internal`](Table_Internal.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getRow()

```ts
getRow: (id, searchAll?) => Row<TFeatures, TData>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L121)

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

Defined in: [core/rows/coreRowsFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L117)

#### Parameters

##### \_

`TData`

##### index

`number`

##### parent?

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`string`
