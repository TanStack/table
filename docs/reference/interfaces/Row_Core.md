---
id: Row_Core
title: Row_Core
---

# Interface: Row\_Core\<TFeatures, TData\>

Defined in: [packages/table-core/src/types/Row.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Row.ts#L21)

## Extends

- [`Row_Row`](Row_Row.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_uniqueValuesCache

```ts
_uniqueValuesCache: Record<string, unknown>;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L11)

#### Inherited from

[`Row_Row`](Row_Row.md).[`_uniqueValuesCache`](Row_Row.md#_uniquevaluescache)

***

### \_valuesCache

```ts
_valuesCache: Record<string, unknown>;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L12)

#### Inherited from

[`Row_Row`](Row_Row.md).[`_valuesCache`](Row_Row.md#_valuescache)

***

### depth

```ts
depth: number;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L16)

The depth of the row (if nested or grouped) relative to the root row array.

#### Inherited from

[`Row_Row`](Row_Row.md).[`depth`](Row_Row.md#depth)

***

### getAllCells()

```ts
getAllCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L55)

Returns all of the cells for the row.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Inherited from

[`Row_Row`](Row_Row.md).[`getAllCells`](Row_Row.md#getallcells)

***

### getAllCellsByColumnId()

```ts
getAllCellsByColumnId: () => Record<string, Cell<TFeatures, TData, unknown>>;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L51)

#### Returns

`Record`\<`string`, [`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>\>

#### Inherited from

[`Row_Row`](Row_Row.md).[`getAllCellsByColumnId`](Row_Row.md#getallcellsbycolumnid)

***

### getLeafRows()

```ts
getLeafRows: () => Row<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L59)

Returns the leaf rows for the row, not including any parent rows.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Inherited from

[`Row_Row`](Row_Row.md).[`getLeafRows`](Row_Row.md#getleafrows)

***

### getParentRow()

```ts
getParentRow: () => Row<TFeatures, TData> | undefined;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L63)

Returns the parent row for the row, if it exists.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\> \| `undefined`

#### Inherited from

[`Row_Row`](Row_Row.md).[`getParentRow`](Row_Row.md#getparentrow)

***

### getParentRows()

```ts
getParentRows: () => Row<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L67)

Returns the parent rows for the row, all the way up to a root row.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Inherited from

[`Row_Row`](Row_Row.md).[`getParentRows`](Row_Row.md#getparentrows)

***

### getUniqueValues()

```ts
getUniqueValues: <TValue>(columnId) => TValue[];
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L71)

Returns a unique array of values from the row for a given columnId.

#### Type Parameters

##### TValue

`TValue`

#### Parameters

##### columnId

`string`

#### Returns

`TValue`[]

#### Inherited from

[`Row_Row`](Row_Row.md).[`getUniqueValues`](Row_Row.md#getuniquevalues)

***

### getValue()

```ts
getValue: <TValue>(columnId) => TValue;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L75)

Returns the value from the row for a given columnId.

#### Type Parameters

##### TValue

`TValue`

#### Parameters

##### columnId

`string`

#### Returns

`TValue`

#### Inherited from

[`Row_Row`](Row_Row.md).[`getValue`](Row_Row.md#getvalue)

***

### id

```ts
id: string;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L20)

The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).

#### Inherited from

[`Row_Row`](Row_Row.md).[`id`](Row_Row.md#id)

***

### index

```ts
index: number;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L24)

The index of the row within its parent array (or the root data array).

#### Inherited from

[`Row_Row`](Row_Row.md).[`index`](Row_Row.md#index)

***

### original

```ts
original: TData;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L28)

The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.

#### Inherited from

[`Row_Row`](Row_Row.md).[`original`](Row_Row.md#original)

***

### originalSubRows?

```ts
optional originalSubRows: TData[];
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L32)

An array of the original subRows as returned by the `options.getSubRows` option.

#### Inherited from

[`Row_Row`](Row_Row.md).[`originalSubRows`](Row_Row.md#originalsubrows)

***

### parentId?

```ts
optional parentId: string;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L36)

If nested, this row's parent row id.

#### Inherited from

[`Row_Row`](Row_Row.md).[`parentId`](Row_Row.md#parentid)

***

### renderValue()

```ts
renderValue: <TValue>(columnId) => TValue;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L79)

Renders the value for the row in a given columnId the same as `getValue`, but will return the `renderFallbackValue` if no value is found.

#### Type Parameters

##### TValue

`TValue`

#### Parameters

##### columnId

`string`

#### Returns

`TValue`

#### Inherited from

[`Row_Row`](Row_Row.md).[`renderValue`](Row_Row.md#rendervalue)

***

### subRows

```ts
subRows: Row<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L40)

An array of subRows for the row as returned and created by the `options.getSubRows` option.

#### Inherited from

[`Row_Row`](Row_Row.md).[`subRows`](Row_Row.md#subrows)

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L44)

Reference to the parent table instance.

#### Inherited from

[`Row_Row`](Row_Row.md).[`table`](Row_Row.md#table)
