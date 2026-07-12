---
id: Row_CoreProperties
title: Row_CoreProperties
---

# Interface: Row\_CoreProperties\<TFeatures, TData\>

Defined in: [core/rows/coreRowsFeature.types.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L8)

## Extended by

- [`Row_Row`](Row_Row.md)

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

***

### \_displayIndexCache

```ts
_displayIndexCache: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L16)

***

### \_uniqueValuesCache

```ts
_uniqueValuesCache: Record<string, unknown>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L17)

***

### \_valuesCache

```ts
_valuesCache: Record<string, unknown>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L18)

***

### depth

```ts
depth: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L22)

The depth of the row (if nested or grouped) relative to the root row array.

***

### id

```ts
id: string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L26)

The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).

***

### index

```ts
index: number;
```

Defined in: [core/rows/coreRowsFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L30)

The index of the row within its parent array (or the root data array).

***

### original

```ts
original: TData;
```

Defined in: [core/rows/coreRowsFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L34)

The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.

***

### originalSubRows?

```ts
optional originalSubRows: readonly TData[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L38)

An array of the original subRows as returned by the `options.getSubRows` option.

***

### parentId?

```ts
optional parentId: string;
```

Defined in: [core/rows/coreRowsFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L42)

If nested, this row's parent row id.

***

### subRows

```ts
subRows: Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L46)

An array of subRows for the row as returned and created by the `options.getSubRows` option.

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [core/rows/coreRowsFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.types.ts#L50)

Reference to the parent table instance.
