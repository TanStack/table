---
id: CreateTableHookResult
title: CreateTableHookResult
---

# Interface: CreateTableHookResult\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

Defined in: [packages/vue-table/src/createTableHook.ts:229](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L229)

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

Defined in: [packages/vue-table/src/createTableHook.ts:236](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L236)

The features object that was passed to `createTableHook`.

***

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:241](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L241)

A column helper pre-bound to `TFeatures` and the registered components, so
the cell/header/footer render props expose the bound components.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

[`AppColumnHelper`](../type-aliases/AppColumnHelper.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

***

### useAppTable()

```ts
useAppTable: <TData>(tableOptions) => AppVueTable<TFeatures, TData, TableState<TFeatures>, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:251](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L251)

Creates a table with the `App*` wrapper components and registered
`tableComponents` attached. `TData` is inferred from the `data` option.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Parameters

##### tableOptions

`Omit`\<[`TableOptionsWithReactiveData`](../type-aliases/TableOptionsWithReactiveData.md)\<`TFeatures`, `TData`\>, `"features"`\>

#### Returns

[`AppVueTable`](../type-aliases/AppVueTable.md)\<`TFeatures`, `TData`, `TableState`\<`TFeatures`\>, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

***

### useCellContext()

```ts
useCellContext: <TValue>() => Cell_Core<TFeatures, any, TValue> & ExtractFeatureMapTypes<TFeatures, Cell_FeatureMap> & TCellComponents & object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:281](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L281)

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

Defined in: [packages/vue-table/src/createTableHook.ts:292](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L292)

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
useTableContext: <TData>() => AppVueTable<TFeatures, TData, TableState<TFeatures>, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:269](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L269)

Reads the table provided by the nearest `<table.AppTable>`. This is the same
extended instance `useAppTable` returns, so the `App*` components and your
`tableComponents` are available on it.

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Returns

[`AppVueTable`](../type-aliases/AppVueTable.md)\<`TFeatures`, `TData`, `TableState`\<`TFeatures`\>, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>
