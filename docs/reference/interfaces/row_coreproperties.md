---
id: Row_CoreProperties
title: Row_CoreProperties
---

# Interface: Row\_CoreProperties\<TFeatures, TData\>

## Extended by

- [`Row_Row`](row_row.md)

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### \_uniqueValuesCache

```ts
_uniqueValuesCache: Record<string, unknown>;
```

#### Defined in

[core/rows/Rows.types.ts:11](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L11)

***

### \_valuesCache

```ts
_valuesCache: Record<string, unknown>;
```

#### Defined in

[core/rows/Rows.types.ts:12](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L12)

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

#### Defined in

[core/rows/Rows.types.ts:18](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L18)

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

#### Defined in

[core/rows/Rows.types.ts:24](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L24)

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

#### Defined in

[core/rows/Rows.types.ts:30](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L30)

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

#### Defined in

[core/rows/Rows.types.ts:36](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L36)

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

#### Defined in

[core/rows/Rows.types.ts:42](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L42)

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

#### Defined in

[core/rows/Rows.types.ts:48](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L48)

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

#### Defined in

[core/rows/Rows.types.ts:54](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/rows/Rows.types.ts#L54)
