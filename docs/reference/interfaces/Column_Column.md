---
id: Column_Column
title: Column_Column
---

# Interface: Column\_Column\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L45)

## Extends

- [`Column_CoreProperties`](Column_CoreProperties.md)\<`TFeatures`, `TData`, `TValue`\>

## Extended by

- [`Column_Core`](Column_Core.md)

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

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L15)

The resolved accessor function to use when extracting the value for the column from each row. Will only be defined if the column def has a valid accessor key or function defined.

#### Inherited from

[`Column_CoreProperties`](Column_CoreProperties.md).[`accessorFn`](Column_CoreProperties.md#accessorfn)

***

### columnDef

```ts
columnDef: ColumnDef<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L19)

The original column def used to create the column.

#### Inherited from

[`Column_CoreProperties`](Column_CoreProperties.md).[`columnDef`](Column_CoreProperties.md#columndef)

***

### columns

```ts
columns: Column<TFeatures, TData, TValue>[];
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L23)

The child column (if the column is a group column). Will be an empty array if the column is not a group column.

#### Inherited from

[`Column_CoreProperties`](Column_CoreProperties.md).[`columns`](Column_CoreProperties.md#columns)

***

### depth

```ts
depth: number;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L27)

The depth of the column (if grouped) relative to the root column def array.

#### Inherited from

[`Column_CoreProperties`](Column_CoreProperties.md).[`depth`](Column_CoreProperties.md#depth)

***

### getFlatColumns()

```ts
getFlatColumns: () => Column<TFeatures, TData, TValue>[];
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L53)

Returns the flattened array of this column and all child/grand-child columns for this column.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>[]

***

### getLeafColumns()

```ts
getLeafColumns: () => Column<TFeatures, TData, TValue>[];
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L57)

Returns an array of all leaf-node columns for this column. If a column has no children, it is considered the only leaf-node column.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>[]

***

### id

```ts
id: string;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L34)

The resolved unique identifier for the column resolved in this priority:
   - A manual `id` property from the column def
   - The accessor key from the column def
   - The header string from the column def

#### Inherited from

[`Column_CoreProperties`](Column_CoreProperties.md).[`id`](Column_CoreProperties.md#id)

***

### parent?

```ts
optional parent: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L38)

The parent column for this column. Will be undefined if this is a root column.

#### Inherited from

[`Column_CoreProperties`](Column_CoreProperties.md).[`parent`](Column_CoreProperties.md#parent)

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L42)

Reference to the parent table instance.

#### Inherited from

[`Column_CoreProperties`](Column_CoreProperties.md).[`table`](Column_CoreProperties.md#table)
