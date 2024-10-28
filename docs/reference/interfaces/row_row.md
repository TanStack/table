---
id: Row_Row
title: Row_Row
---

# Interface: Row\_Row\<TFeatures, TData\>

## Extends

- [`Row_CoreProperties`](row_coreproperties.md)\<`TFeatures`, `TData`\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_uniqueValuesCache

```ts
_uniqueValuesCache: Record<string, unknown>;
```

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`_uniqueValuesCache`](Row_CoreProperties.md#_uniquevaluescache)

#### Defined in

[core/rows/Rows.types.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L11)

***

### \_valuesCache

```ts
_valuesCache: Record<string, unknown>;
```

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`_valuesCache`](Row_CoreProperties.md#_valuescache)

#### Defined in

[core/rows/Rows.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L12)

***

### depth

```ts
depth: number;
```

The depth of the row (if nested or grouped) relative to the root row array.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#depth)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`depth`](Row_CoreProperties.md#depth)

#### Defined in

[core/rows/Rows.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L18)

***

### getAllCells()

```ts
getAllCells: () => Cell<TFeatures, TData, unknown>[];
```

Returns all of the cells for the row.

#### Returns

[`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#getallcells)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Defined in

[core/rows/Rows.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L69)

***

### getAllCellsByColumnId()

```ts
getAllCellsByColumnId: () => Record<string, Cell<TFeatures, TData, unknown>>;
```

#### Returns

`Record`\<`string`, [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>\>

#### Defined in

[core/rows/Rows.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L63)

***

### getLeafRows()

```ts
getLeafRows: () => Row<TFeatures, TData>[];
```

Returns the leaf rows for the row, not including any parent rows.

#### Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#getleafrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Defined in

[core/rows/Rows.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L75)

***

### getParentRow()

```ts
getParentRow: () => undefined | Row<TFeatures, TData>;
```

Returns the parent row for the row, if it exists.

#### Returns

`undefined` \| [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#getparentrow)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Defined in

[core/rows/Rows.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L81)

***

### getParentRows()

```ts
getParentRows: () => Row<TFeatures, TData>[];
```

Returns the parent rows for the row, all the way up to a root row.

#### Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#getparentrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Defined in

[core/rows/Rows.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L87)

***

### getUniqueValues()

```ts
getUniqueValues: <TValue>(columnId) => TValue[];
```

Returns a unique array of values from the row for a given columnId.

#### Type Parameters

• **TValue**

#### Parameters

• **columnId**: `string`

#### Returns

`TValue`[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#getuniquevalues)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Defined in

[core/rows/Rows.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L93)

***

### getValue()

```ts
getValue: <TValue>(columnId) => TValue;
```

Returns the value from the row for a given columnId.

#### Type Parameters

• **TValue**

#### Parameters

• **columnId**: `string`

#### Returns

`TValue`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#getvalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Defined in

[core/rows/Rows.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L99)

***

### id

```ts
id: string;
```

The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#id)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`id`](Row_CoreProperties.md#id)

#### Defined in

[core/rows/Rows.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L24)

***

### index

```ts
index: number;
```

The index of the row within its parent array (or the root data array).

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#index)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`index`](Row_CoreProperties.md#index)

#### Defined in

[core/rows/Rows.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L30)

***

### original

```ts
original: TData;
```

The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#original)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`original`](Row_CoreProperties.md#original)

#### Defined in

[core/rows/Rows.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L36)

***

### originalSubRows?

```ts
optional originalSubRows: TData[];
```

An array of the original subRows as returned by the `options.getSubRows` option.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#originalsubrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`originalSubRows`](Row_CoreProperties.md#originalsubrows)

#### Defined in

[core/rows/Rows.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L42)

***

### parentId?

```ts
optional parentId: string;
```

If nested, this row's parent row id.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#parentid)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`parentId`](Row_CoreProperties.md#parentid)

#### Defined in

[core/rows/Rows.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L48)

***

### renderValue()

```ts
renderValue: <TValue>(columnId) => TValue;
```

Renders the value for the row in a given columnId the same as `getValue`, but will return the `renderFallbackValue` if no value is found.

#### Type Parameters

• **TValue**

#### Parameters

• **columnId**: `string`

#### Returns

`TValue`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#rendervalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Defined in

[core/rows/Rows.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L105)

***

### subRows

```ts
subRows: Row<TFeatures, TData>[];
```

An array of subRows for the row as returned and created by the `options.getSubRows` option.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/row#subrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/rows)

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`subRows`](Row_CoreProperties.md#subrows)

#### Defined in

[core/rows/Rows.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L54)

***

### ~~table~~

```ts
table: Table_Internal<TFeatures, TData>;
```

#### Deprecated

Reference to the table instance.

#### Inherited from

[`Row_CoreProperties`](row_coreproperties.md).[`table`](Row_CoreProperties.md#table)

#### Defined in

[core/rows/Rows.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.types.ts#L58)
