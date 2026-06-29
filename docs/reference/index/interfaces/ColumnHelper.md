---
id: ColumnHelper
title: ColumnHelper
---

# Interface: ColumnHelper\<TFeatures, TData\>

Defined in: [helpers/columnHelper.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L13)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### accessor()

```ts
accessor: <TAccessor, TValue>(accessor, column) => TAccessor extends AccessorFn<TData> ? AccessorFnColumnDef<TFeatures, TData, TValue> : AccessorKeyColumnDef<TFeatures, TData, TValue>;
```

Defined in: [helpers/columnHelper.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L25)

Creates a data column definition with an accessor key or function to extract the cell value.

#### Type Parameters

##### TAccessor

`TAccessor` *extends* `string` \| [`AccessorFn`](../type-aliases/AccessorFn.md)\<`TData`\>

##### TValue

`TValue` *extends* `unknown`

#### Parameters

##### accessor

`TAccessor`

##### column

`TAccessor` *extends* [`AccessorFn`](../type-aliases/AccessorFn.md)\<`TData`\> ? [`DisplayColumnDef`](../type-aliases/DisplayColumnDef.md)\<`TFeatures`, `TData`, `TValue`\> : [`IdentifiedColumnDef`](../type-aliases/IdentifiedColumnDef.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`TAccessor` *extends* [`AccessorFn`](../type-aliases/AccessorFn.md)\<`TData`\> ? [`AccessorFnColumnDef`](../type-aliases/AccessorFnColumnDef.md)\<`TFeatures`, `TData`, `TValue`\> : [`AccessorKeyColumnDef`](../type-aliases/AccessorKeyColumnDef.md)\<`TFeatures`, `TData`, `TValue`\>

#### Example

```ts
helper.accessor('firstName', { cell: (info) => info.getValue() })
helper.accessor((row) => row.lastName, { id: 'lastName' })
```

***

### columns()

```ts
columns: <TColumns>(columns) => ColumnDef<TFeatures, TData, any>[] & [...TColumns[]];
```

Defined in: [helpers/columnHelper.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L48)

Wraps an array of column definitions to preserve each column's individual TValue type.
Uses variadic tuple types to infer element types before checking constraints, preventing type widening.

#### Type Parameters

##### TColumns

`TColumns` *extends* readonly [`ColumnDef`](../type-aliases/ColumnDef.md)\<`TFeatures`, `TData`, `any`\>[]

#### Parameters

##### columns

\[`...TColumns[]`\]

#### Returns

[`ColumnDef`](../type-aliases/ColumnDef.md)\<`TFeatures`, `TData`, `any`\>[] & \[`...TColumns[]`\]

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

[`DisplayColumnDef`](../type-aliases/DisplayColumnDef.md)\<`TFeatures`, `TData`\>

#### Returns

[`DisplayColumnDef`](../type-aliases/DisplayColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>

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

[`GroupColumnDef`](../type-aliases/GroupColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>

#### Returns

[`GroupColumnDef`](../type-aliases/GroupColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>

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
