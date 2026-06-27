---
id: Column_Internal
title: Column_Internal
---

# Interface: Column\_Internal\<TFeatures, TData, TValue\>

Defined in: [types/Column.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L46)

## Extends

- `Omit`\<[`Column_Core`](Column_Core.md)\<`TFeatures`, `TData`, `TValue`\>, `"columnDef"` \| `"table"`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` = `unknown`

## Properties

### accessorFn?

```ts
optional accessorFn: AccessorFn<TData, TValue>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L15)

The resolved accessor function to use when extracting the value for the column from each row. Will only be defined if the column def has a valid accessor key or function defined.

#### Inherited from

```ts
Omit.accessorFn
```

***

### columnDef

```ts
columnDef: ColumnDefBase_All<TFeatures, TData, TValue>;
```

Defined in: [types/Column.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L51)

***

### columns

```ts
columns: Column<TFeatures, TData, TValue>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L23)

The child column (if the column is a group column). Will be an empty array if the column is not a group column.

#### Inherited from

```ts
Omit.columns
```

***

### depth

```ts
depth: number;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L27)

The depth of the column (if grouped) relative to the root column def array.

#### Inherited from

[`Column_Core`](Column_Core.md).[`depth`](Column_Core.md#depth)

***

### getFlatColumns()

```ts
getFlatColumns: () => Column<TFeatures, TData, TValue>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L53)

Flattens this column and every descendant column into a single array.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>[]

#### Inherited from

```ts
Omit.getFlatColumns
```

***

### getLeafColumns()

```ts
getLeafColumns: () => Column<TFeatures, TData, TValue>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L58)

Collects the terminal leaf columns below this column, or the column itself
when it has no children.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>[]

#### Inherited from

```ts
Omit.getLeafColumns
```

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

#### Inherited from

[`Column_Core`](Column_Core.md).[`id`](Column_Core.md#id)

***

### parent?

```ts
optional parent: Column<TFeatures, TData, TValue>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L38)

The parent column for this column. Will be undefined if this is a root column.

#### Inherited from

```ts
Omit.parent
```

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [types/Column.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Column.ts#L52)
