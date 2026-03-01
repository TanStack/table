---
id: ColumnHelper
title: ColumnHelper
---

# Type Alias: ColumnHelper\<TFeatures, TData\>

```ts
type ColumnHelper<TFeatures, TData> = object;
```

Defined in: [helpers/columnHelper.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L13)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

## Properties

### accessor()

```ts
accessor: <TAccessor, TValue>(accessor, column) => TAccessor extends AccessorFn<TData> ? AccessorFnColumnDef<TFeatures, TData, TValue> : AccessorKeyColumnDef<TFeatures, TData, TValue>;
```

Defined in: [helpers/columnHelper.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L25)

Creates a data column definition with an accessor key or function to extract the cell value.

#### Type Parameters

##### TAccessor

`TAccessor` *extends* 
  \| [`AccessorFn`](AccessorFn.md)\<`TData`\>
  \| [`DeepKeys`](DeepKeys.md)\<`TData`\>

##### TValue

`TValue` *extends* `TAccessor` *extends* [`AccessorFn`](AccessorFn.md)\<`TData`, infer TReturn\> ? `TReturn` : `TAccessor` *extends* [`DeepKeys`](DeepKeys.md)\<`TData`\> ? [`DeepValue`](DeepValue.md)\<`TData`, `TAccessor`\> : `never`

#### Parameters

##### accessor

`TAccessor`

##### column

`TAccessor` *extends* [`AccessorFn`](AccessorFn.md)\<`TData`\> ? [`DisplayColumnDef`](DisplayColumnDef.md)\<`TFeatures`, `TData`, `TValue`\> : [`IdentifiedColumnDef`](IdentifiedColumnDef.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`TAccessor` *extends* [`AccessorFn`](AccessorFn.md)\<`TData`\> ? [`AccessorFnColumnDef`](AccessorFnColumnDef.md)\<`TFeatures`, `TData`, `TValue`\> : [`AccessorKeyColumnDef`](AccessorKeyColumnDef.md)\<`TFeatures`, `TData`, `TValue`\>

#### Example

```ts
helper.accessor('firstName', { cell: (info) => info.getValue() })
helper.accessor((row) => row.lastName, { id: 'lastName' })
```

***

### columns()

```ts
columns: <TColumns>(columns) => ColumnDef<TFeatures, TData, any>[] & [...TColumns];
```

Defined in: [helpers/columnHelper.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L48)

Wraps an array of column definitions to preserve each column's individual TValue type.
Uses variadic tuple types to infer element types before checking constraints, preventing type widening.

#### Type Parameters

##### TColumns

`TColumns` *extends* `ReadonlyArray`\<[`ColumnDef`](ColumnDef.md)\<`TFeatures`, `TData`, `any`\>\>

#### Parameters

##### columns

\[`...TColumns`\]

#### Returns

[`ColumnDef`](ColumnDef.md)\<`TFeatures`, `TData`, `any`\>[] & \[`...TColumns`\]

#### Example

```ts
helper.columns([helper.accessor('firstName', {}), helper.accessor('age', {})])
```

***

### display()

```ts
display: (column) => DisplayColumnDef<TFeatures, TData, unknown>;
```

Defined in: [helpers/columnHelper.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L58)

Creates a display column definition for non-data columns like actions or row selection.

#### Parameters

##### column

[`DisplayColumnDef`](DisplayColumnDef.md)\<`TFeatures`, `TData`\>

#### Returns

[`DisplayColumnDef`](DisplayColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>

#### Example

```ts
helper.display({ id: 'actions', header: 'Actions', cell: () => <button>Edit</button> })
```

***

### group()

```ts
group: (column) => GroupColumnDef<TFeatures, TData, unknown>;
```

Defined in: [helpers/columnHelper.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L75)

Creates a group column definition that contains nested child columns.

#### Parameters

##### column

[`GroupColumnDef`](GroupColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>

#### Returns

[`GroupColumnDef`](GroupColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>

#### Example

```ts
helper.group({
  id: 'name',
  header: 'Name',
  columns: helper.columns([
    helper.accessor('firstName', {}),
    helper.accessor('lastName', { id: 'lastName' }),
  ]),
})
```
