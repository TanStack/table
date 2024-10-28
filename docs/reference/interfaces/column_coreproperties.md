---
id: Column_CoreProperties
title: Column_CoreProperties
---

# Interface: Column\_CoreProperties\<TFeatures, TData, TValue\>

## Extended by

- [`Column_Column`](column_column.md)

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### accessorFn?

```ts
optional accessorFn: AccessorFn<TData, TValue>;
```

The resolved accessor function to use when extracting the value for the column from each row. Will only be defined if the column def has a valid accessor key or function defined.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/column#accessorfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-defs)

#### Defined in

[core/columns/Columns.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L17)

***

### columnDef

```ts
columnDef: ColumnDef<TFeatures, TData, TValue>;
```

The original column def used to create the column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/column#columndef)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-defs)

#### Defined in

[core/columns/Columns.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L23)

***

### columns

```ts
columns: Column<TFeatures, TData, TValue>[];
```

The child column (if the column is a group column). Will be an empty array if the column is not a group column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/column#columns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-defs)

#### Defined in

[core/columns/Columns.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L29)

***

### depth

```ts
depth: number;
```

The depth of the column (if grouped) relative to the root column def array.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/column#depth)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-defs)

#### Defined in

[core/columns/Columns.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L35)

***

### id

```ts
id: string;
```

The resolved unique identifier for the column resolved in this priority:
   - A manual `id` property from the column def
   - The accessor key from the column def
   - The header string from the column def

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/column#id)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-defs)

#### Defined in

[core/columns/Columns.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L44)

***

### parent?

```ts
optional parent: Column<TFeatures, TData, TValue>;
```

The parent column for this column. Will be undefined if this is a root column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/column#parent)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-defs)

#### Defined in

[core/columns/Columns.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L50)

***

### ~~table~~

```ts
table: Table_Internal<TFeatures, TData>;
```

#### Deprecated

Reference to the table instance.

#### Defined in

[core/columns/Columns.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.types.ts#L54)
