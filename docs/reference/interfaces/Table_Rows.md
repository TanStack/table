---
id: Table_Rows
title: Table_Rows
---

# Interface: Table\_Rows\<TFeatures, TData\>

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L102)

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

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L110)

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

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L106)

#### Parameters

##### \_

`TData`

##### index

`number`

##### parent?

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`string`
