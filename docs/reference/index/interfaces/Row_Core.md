---
id: Row_Core
title: Row_Core
---

# Interface: Row\_Core\<TFeatures, TData\>

Defined in: [types/Row.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Row.ts#L12)

## Extends

- [`Row_Row`](Row_Row.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_cellsCache?

```ts
optional _cellsCache: WeakMap<Column<TFeatures, TData, unknown>, Cell<TFeatures, TData, unknown>>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L12)

#### Inherited from

[`Row_Row`](Row_Row.md).[`_cellsCache`](Row_Row.md#_cellscache)

***

### \_displayIndexCache

```ts
_displayIndexCache: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L16)

#### Inherited from

[`Row_Row`](Row_Row.md).[`_displayIndexCache`](Row_Row.md#_displayindexcache)

***

### \_uniqueValuesCache

```ts
_uniqueValuesCache: Record<string, unknown>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L17)

#### Inherited from

[`Row_Row`](Row_Row.md).[`_uniqueValuesCache`](Row_Row.md#_uniquevaluescache)

***

### \_valuesCache

```ts
_valuesCache: Record<string, unknown>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L18)

#### Inherited from

[`Row_Row`](Row_Row.md).[`_valuesCache`](Row_Row.md#_valuescache)

***

### depth

```ts
depth: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L22)

The depth of the row (if nested or grouped) relative to the root row array.

#### Inherited from

[`Row_Row`](Row_Row.md).[`depth`](Row_Row.md#depth)

***

### getAllCells()

```ts
getAllCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L69)

Builds one cell for each leaf column, including cells for hidden columns.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Inherited from

[`Row_Row`](Row_Row.md).[`getAllCells`](Row_Row.md#getallcells)

***

### getAllCellsByColumnId()

```ts
getAllCellsByColumnId: () => Record<string, Cell<TFeatures, TData, unknown>>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L65)

Builds a lookup of this row's cells keyed by leaf column id.

#### Returns

`Record`\<`string`, [`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>\>

#### Inherited from

[`Row_Row`](Row_Row.md).[`getAllCellsByColumnId`](Row_Row.md#getallcellsbycolumnid)

***

### getDisplayIndex()

```ts
getDisplayIndex: () => number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L61)

Returns the zero-based index of the row in the current display order
before pagination, or `-1` if the row is not in that model.

#### Returns

`number`

#### Inherited from

[`Row_Row`](Row_Row.md).[`getDisplayIndex`](Row_Row.md#getdisplayindex)

***

### getLeafRows()

```ts
getLeafRows: () => Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L73)

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

Defined in: [core/rows/coreRowsFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L77)

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

Defined in: [core/rows/coreRowsFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L81)

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

Defined in: [core/rows/coreRowsFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L85)

Reads the values this row contributes to faceting/grouping for a column.

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

Defined in: [core/rows/coreRowsFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L89)

Reads this row's accessor value for a column id and caches the result.

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

Defined in: [core/rows/coreRowsFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L26)

The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).

#### Inherited from

[`Row_Row`](Row_Row.md).[`id`](Row_Row.md#id)

***

### index

```ts
index: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L30)

The index of the row within its parent array (or the root data array).

#### Inherited from

[`Row_Row`](Row_Row.md).[`index`](Row_Row.md#index)

***

### original

```ts
original: TData;
```

Defined in: [core/rows/coreRowsFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L34)

The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.

#### Inherited from

[`Row_Row`](Row_Row.md).[`original`](Row_Row.md#original)

***

### originalSubRows?

```ts
optional originalSubRows: readonly TData[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L38)

An array of the original subRows as returned by the `options.getSubRows` option.

#### Inherited from

[`Row_Row`](Row_Row.md).[`originalSubRows`](Row_Row.md#originalsubrows)

***

### parentId?

```ts
optional parentId: string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L42)

If nested, this row's parent row id.

#### Inherited from

[`Row_Row`](Row_Row.md).[`parentId`](Row_Row.md#parentid)

***

### renderValue()

```ts
renderValue: <TValue>(columnId) => TValue;
```

Defined in: [core/rows/coreRowsFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L93)

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

Defined in: [core/rows/coreRowsFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L46)

An array of subRows for the row as returned and created by the `options.getSubRows` option.

#### Inherited from

[`Row_Row`](Row_Row.md).[`subRows`](Row_Row.md#subrows)

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L50)

Reference to the parent table instance.

#### Inherited from

[`Row_Row`](Row_Row.md).[`table`](Row_Row.md#table)
