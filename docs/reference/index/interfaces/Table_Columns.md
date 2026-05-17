---
id: Table_Columns
title: Table_Columns
---

# Interface: Table\_Columns\<TFeatures, TData\>

Defined in: [core/columns/coreColumnsFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L76)

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

Defined in: [core/columns/coreColumnsFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L91)

Normalizes `options.columns` into the table's nested column hierarchy.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getAllFlatColumns()

```ts
getAllFlatColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L95)

Flattens the nested column hierarchy, including parent/group columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getAllFlatColumnsById()

```ts
getAllFlatColumnsById: () => Record<string, Column<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L83)

Returns a map of all flat columns by their ID.

#### Returns

`Record`\<`string`, [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>\>

***

### getAllLeafColumns()

```ts
getAllLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [core/columns/coreColumnsFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L99)

Collects all terminal leaf columns, excluding parent/group columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getAllLeafColumnsById()

```ts
getAllLeafColumnsById: () => Record<string, Column<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L103)

Returns a map of all leaf-node columns by their ID. This does not include parent columns.

#### Returns

`Record`\<`string`, [`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>\>

***

### getColumn()

```ts
getColumn: (columnId) => 
  | Column<TFeatures, TData, unknown>
  | undefined;
```

Defined in: [core/columns/coreColumnsFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L107)

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

Defined in: [core/columns/coreColumnsFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L87)

Resolves built-in, feature-level, and user-defined default column options.

#### Returns

`Partial`\<[`ColumnDef`](../type-aliases/ColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>\>
