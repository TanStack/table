---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:290](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L290)

Creates app-scoped Vue table helpers with features, row models, and
renderable component maps pre-bound.

Use this when an app or design system wants typed `useAppTable`, a pre-bound
column helper, and context helpers for table, cell, and header components.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

## Parameters

### \_\_namedParameters

[`CreateTableHookOptions`](../type-aliases/CreateTableHookOptions.md)\<`TFeatures`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

## Returns

`object`

### appFeatures

```ts
appFeatures: TFeatures;
```

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

[`AppColumnHelper`](../type-aliases/AppColumnHelper.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

### useAppTable()

```ts
useAppTable: <TData>(tableOptions) => AppVueTable<TFeatures, TData, TableState<TFeatures>, TTableComponents, TCellComponents, THeaderComponents>;
```

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Parameters

##### tableOptions

`Omit`\<[`TableOptionsWithReactiveData`](../type-aliases/TableOptionsWithReactiveData.md)\<`TFeatures`, `TData`\>, `"features"`\>

#### Returns

[`AppVueTable`](../type-aliases/AppVueTable.md)\<`TFeatures`, `TData`, `TableState`\<`TFeatures`\>, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

### useCellContext()

```ts
useCellContext: <TValue>() => Cell<TFeatures, any, TValue>;
```

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Cell`\<`TFeatures`, `any`, `TValue`\>

### useHeaderContext()

```ts
useHeaderContext: <TValue>() => Header<TFeatures, any, TValue>;
```

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Header`\<`TFeatures`, `any`, `TValue`\>

### useTableContext()

```ts
useTableContext: <TData>() => VueTable<TFeatures, TData>;
```

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Returns

[`VueTable`](../type-aliases/VueTable.md)\<`TFeatures`, `TData`\>

## Example

```ts
const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
  tableComponents: {},
  cellComponents: {},
  headerComponents: {},
})
```
