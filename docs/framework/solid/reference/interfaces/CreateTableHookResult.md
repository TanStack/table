---
id: CreateTableHookResult
title: CreateTableHookResult
---

# Interface: CreateTableHookResult\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

Defined in: [createTableHook.tsx:406](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L406)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

## Properties

### appFeatures

```ts
appFeatures: TFeatures;
```

Defined in: [createTableHook.tsx:413](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L413)

The features object that was passed to `createTableHook`.

***

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

Defined in: [createTableHook.tsx:418](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L418)

A column helper pre-bound to `TFeatures` and the registered components, so
the cell/header/footer render props expose the bound components.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

[`AppColumnHelper`](../type-aliases/AppColumnHelper.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

***

### createAppTable()

```ts
createAppTable: <TData>(tableOptions) => AppSolidTable<TFeatures, TData, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [createTableHook.tsx:428](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L428)

Creates a table with the `App*` wrapper components and registered
`tableComponents` attached. `TData` is inferred from the `data` option.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Parameters

##### tableOptions

`Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"features"`\>

#### Returns

[`AppSolidTable`](../type-aliases/AppSolidTable.md)\<`TFeatures`, `TData`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

***

### useCellContext()

```ts
useCellContext: <TValue>() => Cell_Core<TFeatures, any, TValue> & ExtractFeatureMapTypes<TFeatures, Cell_FeatureMap> & TCellComponents & object;
```

Defined in: [createTableHook.tsx:453](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L453)

Reads the cell provided by the nearest `<table.AppCell>`, extended with your
`cellComponents` and a context-bound `FlexRender`.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Cell_Core`\<`TFeatures`, `any`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Cell_FeatureMap`\> & `TCellComponents` & `object`

***

### useHeaderContext()

```ts
useHeaderContext: <TValue>() => Header_Core<TFeatures, any, TValue> & ExtractFeatureMapTypes<TFeatures, Header_FeatureMap> & THeaderComponents & object;
```

Defined in: [createTableHook.tsx:464](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L464)

Reads the header provided by the nearest `<table.AppHeader>` /
`<table.AppFooter>`, extended with your `headerComponents` and a
context-bound `FlexRender`.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Header_Core`\<`TFeatures`, `any`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Header_FeatureMap`\> & `THeaderComponents` & `object`

***

### useTableContext()

```ts
useTableContext: <TData>() => AppSolidTable<TFeatures, TData, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [createTableHook.tsx:442](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L442)

Reads the table provided by the nearest `<table.AppTable>`. This is the same
extended instance `createAppTable` returns, so the `App*` components and your
`tableComponents` are available on it.

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Returns

[`AppSolidTable`](../type-aliases/AppSolidTable.md)\<`TFeatures`, `TData`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>
