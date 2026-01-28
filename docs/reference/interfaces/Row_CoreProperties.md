---
id: Row_CoreProperties
title: Row_CoreProperties
---

# Interface: Row\_CoreProperties\<TFeatures, TData\>

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:7](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L7)

## Extended by

- [`Row_Row`](Row_Row.md)

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

***

### \_valuesCache

```ts
_valuesCache: Record<string, unknown>;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L12)

***

### depth

```ts
depth: number;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L16)

The depth of the row (if nested or grouped) relative to the root row array.

***

### id

```ts
id: string;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L20)

The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).

***

### index

```ts
index: number;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L24)

The index of the row within its parent array (or the root data array).

***

### original

```ts
original: TData;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L28)

The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.

***

### originalSubRows?

```ts
optional originalSubRows: TData[];
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L32)

An array of the original subRows as returned by the `options.getSubRows` option.

***

### parentId?

```ts
optional parentId: string;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L36)

If nested, this row's parent row id.

***

### subRows

```ts
subRows: Row<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L40)

An array of subRows for the row as returned and created by the `options.getSubRows` option.

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L44)

Reference to the parent table instance.
