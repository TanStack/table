---
id: TableOptions_Rows
title: TableOptions_Rows
---

# Interface: TableOptions\_Rows\<TFeatures, TData\>

Defined in: [core/rows/coreRowsFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L82)

## Extended by

- [`TableOptions_Core`](TableOptions_Core.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getRowId()?

```ts
optional getRowId: (originalRow, index, parent?) => string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L90)

This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.

#### Parameters

##### originalRow

`TData`

##### index

`number`

##### parent?

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`string`

#### Example

```ts
getRowId: row => row.userId
```

***

### getSubRows()?

```ts
optional getSubRows: (originalRow, index) => readonly TData[] | undefined;
```

Defined in: [core/rows/coreRowsFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L99)

This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.

#### Parameters

##### originalRow

`TData`

##### index

`number`

#### Returns

readonly `TData`[] \| `undefined`

#### Example

```ts
getSubRows: row => row.subRows
```
