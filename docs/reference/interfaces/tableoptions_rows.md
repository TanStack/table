---
id: TableOptions_Rows
title: TableOptions_Rows
---

# Interface: TableOptions\_Rows\<TFeatures, TData\>

## Extended by

- [`TableOptions_Core`](tableoptions_core.md)

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### debugRows?

```ts
optional debugRows: boolean;
```

Set this option to `true` to output row debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/rows/Rows.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L117)

***

### getRowId()?

```ts
optional getRowId: (originalRow, index, parent?) => string;
```

This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.

#### Parameters

• **originalRow**: `TData`

• **index**: `number`

• **parent?**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

#### Returns

`string`

#### Example

```ts
getRowId: row => row.userId
```

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowid)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/rows/Rows.types.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L124)

***

### getSubRows()?

```ts
optional getSubRows: (originalRow, index) => undefined | TData[];
```

This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.

#### Parameters

• **originalRow**: `TData`

• **index**: `number`

#### Returns

`undefined` \| `TData`[]

#### Example

```ts
getSubRows: row => row.subRows
```

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getsubrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/rows/Rows.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L135)
