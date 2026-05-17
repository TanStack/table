---
id: Row_Row
title: Row_Row
---

# Interface: Row\_Row\<TFeatures, TData\>

Defined in: [core/rows/coreRowsFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L47)

## Extends

- [`Row_CoreProperties`](Row_CoreProperties.md)\<`TFeatures`, `TData`\>

## Extended by

- [`Row_Core`](Row_Core.md)

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

Defined in: [core/rows/coreRowsFeature.types.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L11)

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`_uniqueValuesCache`](Row_CoreProperties.md#_uniquevaluescache)

***

### \_valuesCache

```ts
_valuesCache: Record<string, unknown>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L12)

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`_valuesCache`](Row_CoreProperties.md#_valuescache)

***

### depth

```ts
depth: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L16)

The depth of the row (if nested or grouped) relative to the root row array.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`depth`](Row_CoreProperties.md#depth)

***

### getAllCells()

```ts
getAllCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L58)

Builds one cell for each leaf column, including cells for hidden columns.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getAllCellsByColumnId()

```ts
getAllCellsByColumnId: () => Record<string, Cell<TFeatures, TData, unknown>>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L54)

Builds a lookup of this row's cells keyed by leaf column id.

#### Returns

`Record`\<`string`, [`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>\>

***

### getLeafRows()

```ts
getLeafRows: () => Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L62)

Returns the leaf rows for the row, not including any parent rows.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### getParentRow()

```ts
getParentRow: () => Row<TFeatures, TData> | undefined;
```

Defined in: [core/rows/coreRowsFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L66)

Returns the parent row for the row, if it exists.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### getParentRows()

```ts
getParentRows: () => Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L70)

Returns the parent rows for the row, all the way up to a root row.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### getUniqueValues()

```ts
getUniqueValues: <TValue>(columnId) => TValue[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L74)

Reads the values this row contributes to faceting/grouping for a column.

#### Type Parameters

##### TValue

`TValue`

#### Parameters

##### columnId

`string`

#### Returns

`TValue`[]

***

### getValue()

```ts
getValue: <TValue>(columnId) => TValue;
```

Defined in: [core/rows/coreRowsFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L78)

Reads this row's accessor value for a column id and caches the result.

#### Type Parameters

##### TValue

`TValue`

#### Parameters

##### columnId

`string`

#### Returns

`TValue`

***

### id

```ts
id: string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L20)

The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`id`](Row_CoreProperties.md#id)

***

### index

```ts
index: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L24)

The index of the row within its parent array (or the root data array).

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`index`](Row_CoreProperties.md#index)

***

### original

```ts
original: TData;
```

Defined in: [core/rows/coreRowsFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L28)

The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`original`](Row_CoreProperties.md#original)

***

### originalSubRows?

```ts
optional originalSubRows: readonly TData[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L32)

An array of the original subRows as returned by the `options.getSubRows` option.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`originalSubRows`](Row_CoreProperties.md#originalsubrows)

***

### parentId?

```ts
optional parentId: string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L36)

If nested, this row's parent row id.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`parentId`](Row_CoreProperties.md#parentid)

***

### renderValue()

```ts
renderValue: <TValue>(columnId) => TValue;
```

Defined in: [core/rows/coreRowsFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L82)

Renders the value for the row in a given columnId the same as `getValue`, but will return the `renderFallbackValue` if no value is found.

#### Type Parameters

##### TValue

`TValue`

#### Parameters

##### columnId

`string`

#### Returns

`TValue`

***

### subRows

```ts
subRows: Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L40)

An array of subRows for the row as returned and created by the `options.getSubRows` option.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`subRows`](Row_CoreProperties.md#subrows)

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L44)

Reference to the parent table instance.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`table`](Row_CoreProperties.md#table)
