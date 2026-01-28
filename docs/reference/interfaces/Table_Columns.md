---
id: Table_Columns
title: Table_Columns
---

# Interface: Table\_Columns\<TFeatures, TData\>

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L75)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getAllColumns()

```ts
getAllColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L90)

Returns all columns in the table in their normalized and nested hierarchy.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getAllFlatColumns()

```ts
getAllFlatColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L94)

Returns all columns in the table flattened to a single level.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getAllFlatColumnsById()

```ts
getAllFlatColumnsById: () => Record<string, Column<TFeatures, TData, unknown>>;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L82)

Returns a map of all flat columns by their ID.

#### Returns

`Record`\<`string`, [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>\>

***

### getAllLeafColumns()

```ts
getAllLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L98)

Returns all leaf-node columns in the table flattened to a single level. This does not include parent columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getColumn()

```ts
getColumn: (columnId) => 
  | Column<TFeatures, TData, unknown>
  | undefined;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L102)

Returns a single column by its ID.

#### Parameters

##### columnId

`string`

#### Returns

  \| [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>
  \| `undefined`

***

### getDefaultColumnDef()

```ts
getDefaultColumnDef: () => Partial<ColumnDef<TFeatures, TData, unknown>>;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L86)

Returns the default column options to use for all column defs supplied to the table.

#### Returns

`Partial`\<[`ColumnDef`](../type-aliases/ColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>\>
