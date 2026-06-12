---
id: TableFeature
title: TableFeature
---

# Interface: TableFeature

Defined in: [types/TableFeatures.ts:219](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L219)

## Properties

### assignCellPrototype()?

```ts
optional assignCellPrototype: <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:224](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L224)

Assigns Cell APIs to the cell prototype for memory-efficient method sharing.
This is called once per table to build a shared prototype for all cells.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### prototype

`Record`\<`string`, `any`\>

##### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### assignColumnPrototype()?

```ts
optional assignColumnPrototype: <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:235](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L235)

Assigns Column APIs to the column prototype for memory-efficient method sharing.
This is called once per table to build a shared prototype for all columns.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### prototype

`Record`\<`string`, `any`\>

##### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### assignHeaderPrototype()?

```ts
optional assignHeaderPrototype: <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:246](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L246)

Assigns Header APIs to the header prototype for memory-efficient method sharing.
This is called once per table to build a shared prototype for all headers.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### prototype

`Record`\<`string`, `any`\>

##### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### assignRowPrototype()?

```ts
optional assignRowPrototype: <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:257](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L257)

Assigns Row APIs to the row prototype for memory-efficient method sharing.
This is called once per table to build a shared prototype for all rows.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### prototype

`Record`\<`string`, `any`\>

##### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### constructTableAPIs()?

```ts
optional constructTableAPIs: <TFeatures, TData>(table) => void;
```

Defined in: [types/TableFeatures.ts:265](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L265)

Assigns Table APIs to the table instance.
Unlike row/cell/column/header, the table is a singleton so methods are assigned directly.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`void`

***

### getDefaultColumnDef()?

```ts
optional getDefaultColumnDef: <TFeatures, TData, TValue>() => ColumnDefBase_All<TFeatures, TData, TValue>;
```

Defined in: [types/TableFeatures.ts:268](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L268)

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

[`ColumnDefBase_All`](../type-aliases/ColumnDefBase_All.md)\<`TFeatures`, `TData`, `TValue`\>

***

### getDefaultTableOptions()?

```ts
optional getDefaultTableOptions: <TFeatures, TData>(table) => Partial<TableOptions_All<TFeatures, TData>>;
```

Defined in: [types/TableFeatures.ts:273](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L273)

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

#### Returns

`Partial`\<[`TableOptions_All`](../type-aliases/TableOptions_All.md)\<`TFeatures`, `TData`\>\>

***

### getInitialState()?

```ts
optional getInitialState: (initialState) => TableState_All;
```

Defined in: [types/TableFeatures.ts:279](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L279)

#### Parameters

##### initialState

`Partial`\<[`TableState_All`](../type-aliases/TableState_All.md)\>

#### Returns

[`TableState_All`](../type-aliases/TableState_All.md)

***

### initRowInstanceData()?

```ts
optional initRowInstanceData: <TFeatures, TData>(row) => void;
```

Defined in: [types/TableFeatures.ts:284](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L284)

Initializes instance-specific data on each row (e.g., caches).
Methods should be assigned via assignRowPrototype instead.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`void`
