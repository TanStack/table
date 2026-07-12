---
id: Row_Row
title: Row_Row
---

# Interface: Row\_Row\<TFeatures, TData\>

Defined in: [core/rows/coreRowsFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L62)

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

### \_cellsCache?

```ts
optional _cellsCache: WeakMap<Column<TFeatures, TData, unknown>, Cell<TFeatures, TData, unknown>>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L12)

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`_cellsCache`](Row_CoreProperties.md#_cellscache)

***

### \_displayIndexCache

```ts
_displayIndexCache: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L25)

**`Internal`**

Internal cache used while resolving the current display order.

This value may be stale until display order is recomputed. Use
`row.getDisplayIndex()` instead; it refreshes and validates the cached
position before returning it.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`_displayIndexCache`](Row_CoreProperties.md#_displayindexcache)

***

### \_uniqueValuesCache

```ts
_uniqueValuesCache: Record<string, unknown>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L26)

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`_uniqueValuesCache`](Row_CoreProperties.md#_uniquevaluescache)

***

### \_valuesCache

```ts
_valuesCache: Record<string, unknown>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L27)

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`_valuesCache`](Row_CoreProperties.md#_valuescache)

***

### depth

```ts
depth: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L31)

The depth of the row (if nested or grouped) relative to the root row array.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`depth`](Row_CoreProperties.md#depth)

***

### getAllCells()

```ts
getAllCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L80)

Builds one cell for each leaf column, including cells for hidden columns.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getAllCellsByColumnId()

```ts
getAllCellsByColumnId: () => Record<string, Cell<TFeatures, TData, unknown>>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L76)

Builds a lookup of this row's cells keyed by leaf column id.

#### Returns

`Record`\<`string`, [`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>\>

***

### getDisplayIndex()

```ts
getDisplayIndex: () => number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L72)

Returns the zero-based index of the row in the current display order
before pagination, or `-1` if the row is not in that model. Use this for
display row-number columns instead of `row.index` or the internal
`_displayIndexCache` field.

#### Returns

`number`

***

### getLeafRows()

```ts
getLeafRows: () => Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L84)

Returns the leaf rows for the row, not including any parent rows.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### getParentRow()

```ts
getParentRow: () => Row<TFeatures, TData> | undefined;
```

Defined in: [core/rows/coreRowsFeature.types.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L88)

Returns the parent row for the row, if it exists.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### getParentRows()

```ts
getParentRows: () => Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L92)

Returns the parent rows for the row, all the way up to a root row.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### getUniqueValues()

```ts
getUniqueValues: <TValue>(columnId) => TValue[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L96)

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

Defined in: [core/rows/coreRowsFeature.types.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L100)

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

Defined in: [core/rows/coreRowsFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L35)

The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`id`](Row_CoreProperties.md#id)

***

### index

```ts
index: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L39)

The index of the row within its parent array (or the root data array).

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`index`](Row_CoreProperties.md#index)

***

### original

```ts
original: TData;
```

Defined in: [core/rows/coreRowsFeature.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L43)

The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`original`](Row_CoreProperties.md#original)

***

### originalSubRows?

```ts
optional originalSubRows: readonly TData[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L47)

An array of the original subRows as returned by the `options.getSubRows` option.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`originalSubRows`](Row_CoreProperties.md#originalsubrows)

***

### parentId?

```ts
optional parentId: string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L51)

If nested, this row's parent row id.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`parentId`](Row_CoreProperties.md#parentid)

***

### renderValue()

```ts
renderValue: <TValue>(columnId) => TValue;
```

Defined in: [core/rows/coreRowsFeature.types.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L104)

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

Defined in: [core/rows/coreRowsFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L55)

An array of subRows for the row as returned and created by the `options.getSubRows` option.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`subRows`](Row_CoreProperties.md#subrows)

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L59)

Reference to the parent table instance.

#### Inherited from

[`Row_CoreProperties`](Row_CoreProperties.md).[`table`](Row_CoreProperties.md#table)
