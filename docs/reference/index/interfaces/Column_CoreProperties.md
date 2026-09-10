---
id: Column_CoreProperties
title: Column_CoreProperties
---

# Interface: Column\_CoreProperties\<TFeatures, TData, TValue\>

Defined in: [core/columns/coreColumnsFeature.types.ts:7](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L7)

## Extended by

- [`Column_Column`](Column_Column.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### accessorFn?

```ts
optional accessorFn: AccessorFn<TData, TValue>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L15)

The resolved accessor function to use when extracting the value for the column from each row. Will only be defined if the column def has a valid accessor key or function defined.

***

### columnDef

```ts
columnDef: ColumnDef<TFeatures, TData, TValue>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L19)

The original column def used to create the column.

***

### columns

```ts
columns: Column<TFeatures, TData, TValue>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L23)

The child column (if the column is a group column). Will be an empty array if the column is not a group column.

***

### depth

```ts
depth: number;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L27)

The depth of the column (if grouped) relative to the root column def array.

***

### id

```ts
id: string;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L34)

The resolved unique identifier for the column resolved in this priority:
   - A manual `id` property from the column def
   - The accessor key from the column def
   - The header string from the column def

***

### parent?

```ts
optional parent: Column<TFeatures, TData, TValue>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L38)

The parent column for this column. Will be undefined if this is a root column.

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L42)

Reference to the parent table instance.
