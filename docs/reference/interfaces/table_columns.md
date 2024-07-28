---
id: Table_Columns
title: Table_Columns
---

# Interface: Table\_Columns\<TFeatures, TData\>

## Extended by

- [`Table_Core`](table_core.md)

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_getAllFlatColumnsById()

```ts
_getAllFlatColumnsById: () => Record<string, Column<TFeatures, TData, unknown>>;
```

#### Returns

`Record`\<`string`, [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>\>

#### Defined in

[core/columns/Columns.types.ts:100](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.types.ts#L100)

***

### \_getDefaultColumnDef()

```ts
_getDefaultColumnDef: () => Partial<ColumnDef<TFeatures, TData, unknown>>;
```

#### Returns

`Partial`\<[`ColumnDef`](../type-aliases/columndef.md)\<`TFeatures`, `TData`, `unknown`\>\>

#### Defined in

[core/columns/Columns.types.ts:104](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.types.ts#L104)

***

### getAllColumns()

```ts
getAllColumns: () => Column<TFeatures, TData, unknown>[];
```

Returns all columns in the table in their normalized and nested hierarchy.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getallcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/columns/Columns.types.ts:110](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.types.ts#L110)

***

### getAllFlatColumns()

```ts
getAllFlatColumns: () => Column<TFeatures, TData, unknown>[];
```

Returns all columns in the table flattened to a single level.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getallflatcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/columns/Columns.types.ts:116](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.types.ts#L116)

***

### getAllLeafColumns()

```ts
getAllLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Returns all leaf-node columns in the table flattened to a single level. This does not include parent columns.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getallleafcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/columns/Columns.types.ts:122](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.types.ts#L122)

***

### getColumn()

```ts
getColumn: (columnId) => undefined | Column<TFeatures, TData, unknown>;
```

Returns a single column by its ID.

#### Parameters

• **columnId**: `string`

#### Returns

`undefined` \| [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcolumn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/columns/Columns.types.ts:128](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.types.ts#L128)
