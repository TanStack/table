---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures>(__namedParameters): object;
```

Defined in: packages/ember-table/declarations/create-table-hook.d.ts:28

Bundles a feature set and shared default options once so every table in your
app can be created without repeating them. Returns a typed column helper
factory and a `createAppTable` that wraps [useTable](useTable.md).

Unlike the React adapter's hook, this does not pre-bind cell/header
components onto the table; render with the `FlexRenderCell`,
`FlexRenderHeader`, and `FlexRenderFooter` components as usual.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

## Parameters

### \_\_namedParameters

[`CreateTableHookOptions`](../type-aliases/CreateTableHookOptions.md)\<`TFeatures`\>

## Returns

`object`

### appFeatures

```ts
appFeatures: TFeatures;
```

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => ColumnHelper<TFeatures, TData>;
```

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

`ColumnHelper`\<`TFeatures`, `TData`\>

### createAppTable()

```ts
createAppTable: <TData>(getTableOptions) => AppEmberTable<TFeatures, TData>;
```

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Parameters

##### getTableOptions

() => `Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"features"`\>

#### Returns

[`AppEmberTable`](../type-aliases/AppEmberTable.md)\<`TFeatures`, `TData`\>

## Example

```ts
const { createAppTable, createAppColumnHelper } = createTableHook({
  features: tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns }),
})

const columnHelper = createAppColumnHelper<Person>()
const columns = columnHelper.columns([...])

// inside a Glimmer component; options stay a thunk so tracked reads are reactive
table = createAppTable(() => ({ columns, data: this.data }))
```
